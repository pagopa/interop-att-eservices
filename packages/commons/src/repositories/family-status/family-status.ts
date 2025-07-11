import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js"; // la tua istanza Drizzle configurata
import { familyStatus } from "../../db/schema/family-status/family-status.js";
import {
  InsertFamilyStatus,
  SelectFamilyStatus,
} from "../../zod/family-status/family-status.js";

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

  async findAll(): Promise<SelectFamilyStatus[]> {
    return await client.select().from(familyStatus);
  },
};
