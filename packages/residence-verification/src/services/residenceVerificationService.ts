import { eq, and, SQL } from "drizzle-orm";
import { UserModel } from "pdnd-models";
import { getContext, logger } from "pdnd-common";
import { TipoParametriRicercaAR001 } from "../model/domain/models.js";
import { userModelNotFound } from "../exceptions/errors.js";
import { db } from "../model/db/index.js";
import { Subject } from "../model/db/subject.model.js";
import { Usecase } from "../model/db/usecase.model.js";
import { Address } from "../model/db/address.model.js";
import { mapUserModel } from "../utilities/mapUserModelUtilities.js";

type AppContextType = {
  correlationId: string;
  authData: {
    purposeId: string;
    clientId?: string;
  };
};

const getAppContext = (): AppContextType => getContext();

export const getUserBySubjectId = async (
  subjectId: string
): Promise<UserModel | null> => {
  try {
    const subjectResult = await db
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, subjectId))
      .execute();

    const subject = subjectResult[0];
    if (!subject) {
      throw userModelNotFound();
    }

    const usecaseResult = await db
      .select()
      .from(Usecase)
      .where(eq(Usecase.subject_id, subject.uuid))
      .execute();

    const usecase = usecaseResult[0];
    if (!usecase) {
      throw userModelNotFound();
    }

    const addressResult = await db
      .select()
      .from(Address)
      .where(eq(Address.id, usecase.address_id))
      .execute();

    const address = addressResult[0];
    if (!address) {
      throw userModelNotFound();
    }

    return await mapUserModel(subject.uuid, subject, address);
  } catch (error) {
    logger.error(
      `Error during getUserBySubjectId for subjectId: ${subjectId}`,
      error
    );
    throw error;
  }
};

export const getById = async (id: string): Promise<UserModel | null> => {
  try {
    const appContext = getAppContext();
    const purposeId = appContext.authData.purposeId;

    const result = await db
      .select({
        usecaseId: Usecase.id,
        purposeId: Usecase.purpose_id,
        subject: Subject,
        address: Address,
      })
      .from(Usecase)
      .where(and(eq(Usecase.id, id), eq(Usecase.purpose_id, purposeId)))
      .innerJoin(Subject, eq(Usecase.subject_id, Subject.uuid))
      .innerJoin(Address, eq(Usecase.address_id, Address.id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    return await mapUserModel(row.subject.uuid, row.subject, row.address);
  } catch (error) {
    const appContext = getAppContext();
    logger.error(
      `UserService: Error retrieving user by id ${id} and purposeId ${appContext.authData.purposeId}.`,
      error
    );
    throw error;
  }
};

export const getByPersonalInfo = async (
  parametriRicerca: TipoParametriRicercaAR001
): Promise<UserModel[]> => {
  try {
    const appContext = getAppContext();
    const purposeId = appContext.authData.purposeId;

    const conditions = [
      parametriRicerca.name ? eq(Subject.name, parametriRicerca.name) : "",
      parametriRicerca.surname
        ? eq(Subject.surname, parametriRicerca.surname)
        : "",
      parametriRicerca.gender
        ? eq(Subject.gender, parametriRicerca.gender)
        : "",
      parametriRicerca.birthDate?.eventDate
        ? eq(Subject.birth_event_date, parametriRicerca.birthDate.eventDate)
        : "",
      parametriRicerca.birthDate?.birthPlace?.municipality?.nameMunicipality
        ? eq(
            Subject.birth_municipality_name,
            parametriRicerca.birthDate.birthPlace.municipality.nameMunicipality
          )
        : "",
      parametriRicerca.birthDate?.birthPlace?.place?.codState
        ? eq(
            Subject.birth_cod_state,
            parametriRicerca.birthDate.birthPlace.place.codState
          )
        : "",
    ].filter((c): c is SQL => !!c);

    const rows = await db
      .select({
        usecaseId: Usecase.id,
        subject: Subject,
        address: Address,
      })
      .from(Usecase)
      .leftJoin(Subject, eq(Usecase.subject_id, Subject.uuid))
      .leftJoin(Address, eq(Usecase.address_id, Address.id))
      .where(and(eq(Usecase.purpose_id, purposeId), ...conditions));

    const validRows = rows.filter(
      (row: {
        usecaseId: string | null;
        subject: Subject | null;
        address: Address | null;
      }) => row.subject !== null && row.address !== null
    );

    const userModels = await Promise.all(
      validRows.map(
        (row: { usecaseId: string; subject: Subject; address: Address }) => 
          mapUserModel(row.usecaseId, row.subject, row.address)
      )
    );

    if (userModels.length === 0) {
      throw userModelNotFound("Not found");
    }

    return userModels;
  } catch (error) {
    logger.error(`UserService: Error during search by personal info`, error);
    throw error;
  }
};
