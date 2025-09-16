import { eq } from "drizzle-orm";
import { client } from "../../index.js";
import { familyStatus } from "../../db/schema/family-status/family-status.js";
import { InsertFamilyStatus } from "../../zod/family-status/family-status.js";
import { DbRecord } from "../../types/dbRecord.js";
import { mapDbRecordToFamilyStatusDto } from "../../model/mappers/mapDbRecordToSelectFamilyStatus.js";
import { FamilyStatusDto } from "../../types/familyStatusDTO.js";
import { CriteriaTypeFS001 } from "../../types/criteriaTypeFS001.js";

export const familyStatusRepo = {
  async upsert(data: InsertFamilyStatus): Promise<object> {
    const [result] = await client
      .insert(familyStatus)
      .values(data)
      .onConflictDoUpdate({
        target: familyStatus.subjectId,
        set: data,
      })
      .returning({ uuid: familyStatus.uuid });

    if (!result?.uuid) {
      throw new Error("UUID not returned from database");
    }

    return { uuid: result.uuid };
  },

  async findByUUID(uuid: string): Promise<FamilyStatusDto> {
    const result = await client
      .select()
      .from(familyStatus)
      .where(eq(familyStatus.uuid, uuid))
      .limit(1);

    return mapDbRecordToFamilyStatusDto(result[0]);
  },

  async findAll(): Promise<FamilyStatusDto[]> {
    const flatRows: DbRecord[] = await client.select().from(familyStatus);
    return flatRows.map((item: DbRecord) => mapDbRecordToFamilyStatusDto(item));
  },

  async deleteAll(): Promise<number> {
    const result = await client.delete(familyStatus);
    return result.rowCount ?? 0;
  },

  async deleteByUUID(uuid: string): Promise<void> {
    await client.delete(familyStatus).where(eq(familyStatus.uuid, uuid));
  },

  async findBySubjectId(subjectId: string): Promise<DbRecord> {
    const result = await client
      .select()
      .from(familyStatus)
      .where(eq(familyStatus.subjectId, subjectId))
      .limit(1);

    return result[0];
  },

  async findById(id: string): Promise<DbRecord> {
    const result = await client
      .select()
      .from(familyStatus)
      .where(eq(familyStatus.id, id))
      .limit(1);

    return result[0];
  },

  async findByPersonalInfo(criteria: CriteriaTypeFS001): Promise<DbRecord[]> {
    const query = client.select().from(familyStatus);

    if (criteria.name) {
      await query.where(eq(familyStatus.name, criteria.name));
    }

    if (criteria.surname) {
      await query.where(eq(familyStatus.surname, criteria.surname));
    }

    if (criteria.birthDate?.eventDate) {
      await query.where(
        eq(familyStatus.birthDate, criteria.birthDate.eventDate)
      );
    }

    if (criteria.birthDate?.placeOfBirth?.place?.codState) {
      await query.where(
        eq(
          familyStatus.place_codState,
          criteria.birthDate.placeOfBirth.place.codState
        )
      );
    }

    if (criteria.birthDate?.placeOfBirth?.municipality?.nameMunicipality) {
      await query.where(
        eq(
          familyStatus.municipality_nameMunicipality,
          criteria.birthDate.placeOfBirth.municipality.nameMunicipality
        )
      );
    }

    return query;
  },
};
