/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, and, SQL } from "drizzle-orm";

import {
  Subject,
  subjectTable,
} from "../../db/schema/residence-verification/subject.model.js";
import {
  Address,
  addressTable,
} from "../../db/schema/residence-verification/address.model.js";
import { client } from "../../index.js";

type SubjectWithAddress = {
  subjects: Subject;
  addresses: Address;
};

export const SubjectRepositoryDirect = {
  async findWithAddressBySubjectId(
    subjectId: string
  ): Promise<SubjectWithAddress[]> {
    return client
      .select()
      .from(subjectTable)
      .innerJoin(addressTable, eq(subjectTable.address_id, addressTable.id))
      .where(eq(subjectTable.subject_id, subjectId))
      .limit(1)
      .execute();
  },

  async findWithAddressByPersonalInfo(
    parametriRicerca: any
  ): Promise<SubjectWithAddress[]> {
    const conditions: SQL[] = [
      parametriRicerca.name
        ? eq(subjectTable.name, parametriRicerca.name)
        : undefined,
      parametriRicerca.surname
        ? eq(subjectTable.surname, parametriRicerca.surname)
        : undefined,
      parametriRicerca.gender
        ? eq(subjectTable.gender, parametriRicerca.gender)
        : undefined,
      parametriRicerca.birthDate?.eventDate
        ? eq(
            subjectTable.birth_event_date,
            parametriRicerca.birthDate.eventDate
          )
        : undefined,
    ].filter((c): c is SQL => c !== undefined);

    if (conditions.length === 0) {
      return [];
    }

    return client
      .select()
      .from(subjectTable)
      .innerJoin(addressTable, eq(subjectTable.address_id, addressTable.id))
      .where(and(...conditions))
      .execute();
  },
};
