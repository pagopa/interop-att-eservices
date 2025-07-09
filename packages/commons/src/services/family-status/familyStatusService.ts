import { z } from "zod";
import { client } from "../../db/postgres/client.js";
import {
  FamilyStatusInputSchema,
  FamilyStatusResponseSchema,
} from "../../zod/family-status/family-status.js";
import {
  InsertMunicipalitySchema,
  SelectMunicipalitySchema,
} from "../../zod/family-status/municipality.js";
import {
  InsertPlaceSchema,
  SelectPlaceSchema,
} from "../../zod/family-status/place.js";
import {
  InsertBirthDateSchema,
  SelectBirthDateSchema,
} from "../../zod/family-status/birth-date.js";
import {
  InsertCriteriaSchema,
  SelectCriteriaSchema,
} from "../../zod/family-status/criteria.js";
import {
  InsertBindingSchema,
  SelectBindingSchema,
} from "../../zod/family-status/binding.js";

import { validateAndInsert } from "../../utility/validateInsert.js";
import { MunicipalityRepository } from "../../repositories/family-status/MunicipalityRepository.js";
import { PlaceRepository } from "../../repositories/family-status/PlaceRepository.js";
import { BirthDateRepository } from "../../repositories/family-status/BirthDateRepository.js";
import { CriteriaRepository } from "../../repositories/family-status/CriteriaRepository.js";
import { CompleteSubjectBindingRepository } from "../../repositories/family-status/CompleteSubjectBindingRepository.js";
import { DBClient } from "../../types/db.js";

type FamilyStatusInsertResult = {
  municipality: z.infer<typeof InsertMunicipalitySchema>;
  place: z.infer<typeof InsertPlaceSchema>;
  birthDate: z.infer<typeof InsertBirthDateSchema>;
  criteria: z.infer<typeof InsertCriteriaSchema>;
  binding: z.infer<typeof InsertBindingSchema> & { subjectId: string };
};

export class FamilyStatusService {
  private municipalityRepo = new MunicipalityRepository();
  private placeRepo = new PlaceRepository();
  private birthDateRepo = new BirthDateRepository();
  private criteriaRepo = new CriteriaRepository();
  private bindingRepo = new CompleteSubjectBindingRepository();

  public async insert(input: unknown): Promise<FamilyStatusInsertResult> {
    const parsed = FamilyStatusInputSchema.parse(input);

    return client.transaction(async (tx: DBClient) => {
      const muniData = InsertMunicipalitySchema.parse(
        parsed.subject.birthDate.placeOfBirth.municipality
      );
      const municipality = await validateAndInsert(
        "Municipality",
        muniData,
        this.municipalityRepo.insert.bind(this.municipalityRepo),
        tx,
        InsertMunicipalitySchema
      );

      const placeData = InsertPlaceSchema.parse(
        parsed.subject.birthDate.placeOfBirth.place
      );
      const place = await validateAndInsert(
        "Place",
        placeData,
        this.placeRepo.insert.bind(this.placeRepo),
        tx,
        InsertPlaceSchema
      );

      const birthDateData = InsertBirthDateSchema.parse({
        eventDate: parsed.subject.birthDate.eventDate,
        noDay: parsed.subject.birthDate.noDay,
        noMonth: parsed.subject.birthDate.noMonth,
        placeOfBirthId: place.id,
      });

      const birthDate = await validateAndInsert(
        "BirthDate",
        birthDateData,
        this.birthDateRepo.insert.bind(this.birthDateRepo),
        tx,
        InsertBirthDateSchema
      );

      const criteriaData = InsertCriteriaSchema.parse({
        subjectId: parsed.subject.subjectId,
        personalId: parsed.subject.personalId,
        surname: parsed.subject.surname,
        nosurname: parsed.subject.nosurname,
        name: parsed.subject.name,
        noname: parsed.subject.noname,
        gender: parsed.subject.gender,
        birthDateId: birthDate.id,
      });
      const criteria = await validateAndInsert(
        "Criteria",
        criteriaData,
        this.criteriaRepo.insert.bind(this.criteriaRepo),
        tx,
        InsertCriteriaSchema
      );

      const bindingSchemaWithSubjectId = InsertBindingSchema.extend({
        subjectId: z.string(),
      });
      const bindingData = bindingSchemaWithSubjectId.parse({
        ...parsed.subjectLink,
        subjectId: parsed.subject.subjectId,
      });
      const binding = await validateAndInsert(
        "CompleteSubjectBinding",
        bindingData,
        this.bindingRepo.insert.bind(this.bindingRepo),
        tx,
        bindingSchemaWithSubjectId
      );

      return this.mapToFamilyStatusInsertResult({
        municipality,
        place,
        birthDate,
        criteria,
        binding,
      });
    });
  }

  public async getBySubjectId(
    subjectId: string
  ): Promise<z.infer<typeof FamilyStatusResponseSchema>> {
    const row = await this.criteriaRepo.findWithJoinsBySubjectId(subjectId);

    if (!row) {
      throw new Error(`Subject ${subjectId} not found`);
    }

    const { criteria, birthDate, place, municipality, binding } = row;

    if (!birthDate || !place || !municipality) {
      throw new Error("Incomplete data");
    }

    const response = {
      criteria: SelectCriteriaSchema.omit({
        id: true,
        birthDateId: true,
      }).parse(criteria),
      birthDate: SelectBirthDateSchema.pick({
        eventDate: true,
        noDay: true,
        noMonth: true,
      }).parse(birthDate),
      placeOfBirth: SelectPlaceSchema.pick({
        placeDescription: true,
        countryDescription: true,
        codState: true,
        provinceCounty: true,
      })
        .extend({ municipality: SelectMunicipalitySchema })
        .parse({ ...place, municipality }),
      relationship: binding
        ? SelectBindingSchema.pick({
            relationshipType: true,
            relationshipCode: true,
            startDate: true,
            startDateRelationship: true,
            memberSequence: true,
          }).parse(binding)
        : null,
    };

    return FamilyStatusResponseSchema.parse(response);
  }

  private mapToFamilyStatusInsertResult(data: {
    municipality: z.infer<typeof InsertMunicipalitySchema>;
    place: z.infer<typeof InsertPlaceSchema>;
    birthDate: z.infer<typeof InsertBirthDateSchema>;
    criteria: z.infer<typeof InsertCriteriaSchema>;
    binding: z.infer<typeof InsertBindingSchema> & { subjectId: string };
  }): FamilyStatusInsertResult {
    return {
      municipality: data.municipality,
      place: data.place,
      birthDate: data.birthDate,
      criteria: data.criteria,
      binding: data.binding,
    };
  }
}
