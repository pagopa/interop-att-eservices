import { UserModel } from "pdnd-models";
import { v4 as uuidv4 } from "uuid";
import { getContext, logger } from "pdnd-common";
import { eq, or } from "drizzle-orm";
import { DataPreparationTemplate } from "../model/domain/models.js";
import { apiDataPreparationTemplateToUserModel } from "../model/domain/apiConverter.js";
import { db } from "../model/db/index.js";
import { Purpose } from "../model/db/purpose.model.js";
import { Subject } from "../model/db/subject.model.js";
import { Address } from "../model/db/address.model.js";
import { Usecase } from "../model/db/usecase.model.js";
import { mapUserModel } from "../utilities/mapUserModelUtilities.js";

class DataPreparationService {
  public appContext = getContext();

  public async create(
    genericRequest: DataPreparationTemplate
  ): Promise<{ uuid: string }> {
    try {
      logger.info("[START] saveList");

      const userData: UserModel = apiDataPreparationTemplateToUserModel(
        genericRequest,
        uuidv4()
      );

      const purposeId = this.appContext.authData.purposeId;

      const [purpose] = await db
        .select()
        .from(Purpose)
        .where(eq(Purpose.id, purposeId));

      logger.info(`Purpose retrieved: ${JSON.stringify(purpose)}`);

      if (!purpose) {
        logger.info(
          `No purpose found, inserting new record with id: ${purposeId}`
        );
        await db.insert(Purpose).values({ id: purposeId });
      } else {
        logger.info(`Purpose already exists: ${JSON.stringify(purpose)}`);
      }

      const [existingSubject] = await db
        .select()
        .from(Subject)
        .where(eq(Subject.subject_id, userData.subject.subjectId));
      const subjectUuid = existingSubject ? existingSubject.uuid : uuidv4();
      if (!existingSubject) {
        await db.insert(Subject).values({
          uuid: subjectUuid,
          id: userData.subject.id,
          subject_id: userData.subject.subjectId,
          surname: userData.subject.surname,
          name: userData.subject.name,
          gender: userData.subject.gender,
          birth_event_date: userData.subject.birthDate.eventDate,
          birth_exceptional_place:
            userData.subject.birthDate.birthPlace.exceptionalPlace,
          birth_municipality_name:
            userData.subject.birthDate.birthPlace.municipality.nameMunicipality,
          birth_municipality_istat_code:
            userData.subject.birthDate.birthPlace.municipality.istatCode,
          birth_municipality_acronym_istat_province:
            userData.subject.birthDate.birthPlace.municipality
              .acronymIstatProvince,
          birth_municipality_place_description:
            userData.subject.birthDate.birthPlace.municipality.placeDescription,
          birth_place_description:
            userData.subject.birthDate.birthPlace.place.placeDescription,
          birth_country_description:
            userData.subject.birthDate.birthPlace.place.countryDescription,
          birth_cod_state: userData.subject.birthDate.birthPlace.place.codState,
          birth_province_county:
            userData.subject.birthDate.birthPlace.place.provinceCounty,
        });
      }

      const [address] = await db
        .insert(Address)
        .values({
          id: uuidv4(),
          address_type: userData.address.addressType,
          note_address: userData.address.addressStartDate,
          address_start_date: userData.address.addressStartDate,
          presso: userData.address.presso,
          address_municipality_name:
            userData.address.address.municipality.nameMunicipality,
          address_municipality_istat_code:
            userData.address.address.municipality.istatCode,
          address_municipality_acronym_istat_province:
            userData.address.address.municipality.acronymIstatProvince,
          address_municipality_place_description:
            userData.address.address.municipality.placeDescription,
          toponym_cod_type: userData.address.address.toponym.codType,
          toponym_type: userData.address.address.toponym.originType,
          toponym_origin_type: userData.address.address.toponym.originType,
          toponym_cod: userData.address.address.toponym.toponymCod,
          toponym_denomination:
            userData.address.address.toponym.toponymDenomination,
          toponym_source: userData.address.address.toponym.toponymSource,
          civic_cod: userData.address.address.civicNumber.civicCod,
          civic_source: userData.address.address.civicNumber.civicSource,
          civic_number: userData.address.address.civicNumber.civicNumber,
          metric: userData.address.address.civicNumber.metric,
          prog_snc: userData.address.address.civicNumber.progSNC,
          letter: userData.address.address.civicNumber.letter,
          exponent1: userData.address.address.civicNumber.exponent1,
          color: userData.address.address.civicNumber.color,
          internal_court:
            userData.address.address.civicNumber.internalCivic.court,
          internal_stairs:
            userData.address.address.civicNumber.internalCivic.stairs,
          internal1:
            userData.address.address.civicNumber.internalCivic.internal1,
          esp_internal1:
            userData.address.address.civicNumber.internalCivic.espInternal1,
          internal2:
            userData.address.address.civicNumber.internalCivic.internal2,
          esp_internal2:
            userData.address.address.civicNumber.internalCivic.espInternal2,
          external_stairs:
            userData.address.address.civicNumber.internalCivic.externalStairs,
          secondary:
            userData.address.address.civicNumber.internalCivic.secondary,
          floor: userData.address.address.civicNumber.internalCivic.floor,
          nui: userData.address.address.civicNumber.internalCivic.nui,
          isolated: userData.address.address.civicNumber.internalCivic.isolated,
          foreign_cap: userData.address.foreignState.foreignAddress.cap,
          foreign_place_description:
            userData.address.foreignState.foreignAddress.place.placeDescription,
          foreign_country_description:
            userData.address.foreignState.foreignAddress.place
              .countryDescription,
          foreign_country_state:
            userData.address.foreignState.foreignAddress.place.countryState,
          foreign_province_county:
            userData.address.foreignState.foreignAddress.place.provinceCounty,
          foreign_toponym_denomination:
            userData.address.foreignState.foreignAddress.toponym.denomination,
          foreign_toponym_civic_number:
            userData.address.foreignState.foreignAddress.toponym.civicNumber,
          consulate_cod: userData.address.foreignState.consulate.consulateCod,
          consulate_description:
            userData.address.foreignState.consulate.consulateDescription,
        })
        .returning({ id: Address.id });

      const usecaseUuid = uuidv4();
      await db.insert(Usecase).values({
        id: usecaseUuid,
        purpose_id: purposeId,
        subject_id: subjectUuid,
        address_id: address.id,
      });

      return { uuid: usecaseUuid };
    } catch (error) {
      logger.error(
        "saveList - Errore durante il salvataggio della lista.",
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<UserModel[] | null> {
    const purposeId = this.appContext.authData.purposeId;

    try {
      const [purpose] = await db
        .select()
        .from(Purpose)
        .where(eq(Purpose.id, purposeId));

      if (!purpose) {
        await db.insert(Purpose).values({ id: purposeId });
      }

      const usecases = await db
        .select()
        .from(Usecase)
        .where(eq(Usecase.purpose_id, purposeId));

      if (!usecases.length) {
        return [];
      }

      const userModels = await Promise.all(
        usecases.map(async (usecase) => {
          const [subject] = await db
            .select()
            .from(Subject)
            .where(eq(Subject.uuid, usecase.subject_id));

          const [address] = await db
            .select()
            .from(Address)
            .where(eq(Address.id, usecase.address_id));

          if (!subject || !address) {
            return null;
          }

          return await mapUserModel(usecase.id, subject, address);
        })
      );

      return userModels.filter(
        (userModel): userModel is UserModel => userModel !== null
      );
    } catch (error) {
      logger.error("Errore in getAll:", error);
      return null;
    }
  }

  public async getByUUID(uuid: string): Promise<UserModel | null> {
    logger.info(`UUID: ${uuid}`);
    try {
      const [useCase] = await db
        .select({
          id: Usecase.id,
          subject: Subject,
          address: Address,
        })
        .from(Usecase)
        .leftJoin(Subject, eq(Usecase.subject_id, Subject.uuid))
        .leftJoin(Address, eq(Usecase.address_id, Address.id))
        .where(eq(Usecase.id, uuid));

      if (!useCase || !useCase.subject || !useCase.address) {
        return null;
      }

      const subjectObject = useCase.subject;
      const addressObject = useCase.address;
      const userModel: UserModel = await mapUserModel(
        useCase.id,
        subjectObject,
        addressObject
      );

      return userModel;
    } catch (error) {
      logger.error("UserService: Errore in getByUUID", error);
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      const purposeId = this.appContext.authData.purposeId;

      const [purpose] = await db
        .select()
        .from(Purpose)
        .where(eq(Purpose.id, purposeId));

      if (!purpose) {
        return null;
      }

      const usecases = await db
        .select({
          subjectId: Usecase.subject_id,
          addressId: Usecase.address_id,
        })
        .from(Usecase)
        .where(eq(Usecase.purpose_id, purposeId));

      const subjectIds = usecases
        .map((u) => u.subjectId)
        .filter((id): id is string => !!id);

      const addressIds = usecases
        .map((u) => u.addressId)
        .filter((id): id is string => !!id);

      await db.delete(Usecase).where(eq(Usecase.purpose_id, purposeId));

      if (subjectIds.length > 0) {
        const subjectConditions = subjectIds.map((id) => eq(Subject.uuid, id));
        await db.delete(Subject).where(or(...subjectConditions));
      }

      if (addressIds.length > 0) {
        const addressConditions = addressIds.map((id) => eq(Address.id, id));
        await db.delete(Address).where(or(...addressConditions));
      }

      return 0;
    } catch (error) {
      logger.error("deleteAllByKey: errore nella cancellazione", error);
      return null;
    }
  }

  public async deleteByUUID(uuid: string): Promise<void> {
    try {
      logger.info(`[START] deleteByUUID`);

      const [useCase] = await db
        .select({
          subjectId: Usecase.subject_id,
          addressId: Usecase.address_id,
        })
        .from(Usecase)
        .where(eq(Usecase.id, uuid));

      if (!useCase) {
        logger.warn(`Usecase con UUID ${uuid} non trovato`);
        return;
      }

      await db.delete(Usecase).where(eq(Usecase.id, uuid));

      if (useCase.subjectId) {
        const otherUsecasesWithSubject = await db
          .select()
          .from(Usecase)
          .where(eq(Usecase.subject_id, useCase.subjectId));

        if (otherUsecasesWithSubject.length === 0) {
          await db.delete(Subject).where(eq(Subject.uuid, useCase.subjectId));
        }
      }

      if (useCase.addressId) {
        const otherUsecasesWithAddress = await db
          .select()
          .from(Usecase)
          .where(eq(Usecase.address_id, useCase.addressId));

        if (otherUsecasesWithAddress.length === 0) {
          await db.delete(Address).where(eq(Address.id, useCase.addressId));
        }
      }

      logger.info(`[END] deleteByUUID`);
    } catch (error) {
      logger.error(`deleteByUUID - Errore durante la cancellazione`, error);
      throw error;
    }
  }
}

export default new DataPreparationService();
