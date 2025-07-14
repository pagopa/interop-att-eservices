import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js"; // la tua istanza Drizzle configurata
import { familyStatus } from "../../db/schema/family-status/family-status.js";
import {
  InsertFamilyStatus,
  SelectFamilyStatus,
} from "../../zod/family-status/family-status.js";
import { DbRecord } from "../../types/dbRecord.js";
import { mapDbRecordToFamilyStatusDto } from "../../zod/family-status/mapDbRecordToSelectFamilyStatus.js";
import { FamilyStatusDto } from "../../types/familyStatusDTO.js";

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

  async findBySubjectId(
    subjectId: string
  ): Promise<SelectFamilyStatus | undefined> {
    const result = await client
      .select()
      .from(familyStatus)
      .where(eq(familyStatus.subjectId, subjectId))
      .limit(1);

    return result[0];
  },
};
