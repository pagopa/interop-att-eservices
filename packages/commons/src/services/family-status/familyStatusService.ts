import { z } from "zod";
import { client } from "../../db/postgres/client.js";
import { FamilyStatusInputSchema } from "../../zod/family-status.js";
import { InsertMunicipalitySchema } from "../../zod/municipality.js";
import { InsertPlaceSchema } from "../../zod/place.js";
import { InsertBirthDateSchema } from "../../zod/birth-date.js";
import { InsertCriteriaSchema } from "../../zod/criteria.js";
import { InsertBindingSchema } from "../../zod/binding.js";

import { MunicipalityRepository } from "../../repositories/family-status/MunicipalityRepository.js";
import { PlaceRepository } from "../../repositories/family-status/PlaceRepository.js";
import { BirthDateRepository } from "../../repositories/family-status/BirthDateRepository.js";
import { CriteriaRepository } from "../../repositories/family-status/CriteriaRepository.js";
import { CompleteSubjectBindingRepository } from "../../repositories/family-status/CompleteSubjectBindingRepository.js";

import { validateAndInsert } from "../../utility/validateInsert.js";

export class FamilyStatusPreparationService {
  private municipalityRepo = new MunicipalityRepository();
  private placeRepo = new PlaceRepository();
  private birthDateRepo = new BirthDateRepository();
  private criteriaRepo = new CriteriaRepository();
  private bindingRepo = new CompleteSubjectBindingRepository();

  public async insert(input: unknown): Promise<unknown> {
    const parsedInput = FamilyStatusInputSchema.parse(input);

    return client.transaction(async (tx) => {
      const {
        subject: {
          subjectId,
          personalId,
          surname,
          nosurname,
          name,
          noname,
          gender,
          birthDate: {
            eventDate,
            noDay,
            noMonth,
            placeOfBirth: { municipality, place },
          },
        },
        subjectLink,
      } = parsedInput;

      const municipalityData = InsertMunicipalitySchema.parse(municipality);
      const municipalityResult = await validateAndInsert(
        "Municipality",
        municipalityData,
        this.municipalityRepo.insert.bind(this.municipalityRepo),
        tx
      );

      const placeData = InsertPlaceSchema.parse(place);
      const placeResult = await validateAndInsert(
        "Place",
        placeData,
        this.placeRepo.insert.bind(this.placeRepo),
        tx
      );

      const placeOfBirthId = (placeResult as { id: string }).id;

      const birthDateData = InsertBirthDateSchema.omit({ placeOfBirth: true })
        .extend({ placeOfBirthId: z.string() })
        .parse({
          eventDate,
          noDay,
          noMonth,
          placeOfBirthId,
        });

      const birthDateResult = await validateAndInsert(
        "BirthDate",
        birthDateData,
        this.birthDateRepo.insert.bind(this.birthDateRepo),
        tx
      );

      const birthDateId = (birthDateResult as { id: string }).id;
      const criteriaData = InsertCriteriaSchema.parse({
        subjectId,
        personalId,
        surname,
        nosurname,
        name,
        noname,
        gender,
        birthDateId,
      });

      const criteriaResult = await validateAndInsert(
        "Criteria",
        criteriaData,
        this.criteriaRepo.insert.bind(this.criteriaRepo),
        tx
      );

      const bindingData = InsertBindingSchema.extend({
        subjectId: z.string(),
      }).parse({
        ...subjectLink,
        subjectId,
      });

      const bindingResult = await validateAndInsert(
        "CompleteSubjectBinding",
        bindingData,
        async (data, db) => {
          const result = await this.bindingRepo.insert.call(
            this.bindingRepo,
            data,
            db
          );
          if (result === undefined) {
            throw new Error(
              "Insert function for CompleteSubjectBinding returned undefined"
            );
          }
          return {
            ...data,
            ...result,
            subjectId: data.subjectId,
          };
        },
        tx
      );

      return {
        municipality: municipalityResult,
        place: placeResult,
        birthDate: birthDateResult,
        criteria: criteriaResult,
        binding: bindingResult,
      };
    });
  }
}
