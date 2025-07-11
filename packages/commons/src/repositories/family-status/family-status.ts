import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js"; // la tua istanza Drizzle configurata
import { familyStatus } from "../../db/schema/family-status/family-status.js";
import {
  InsertFamilyStatus,
  SelectFamilyStatus,
} from "../../zod/family-status/family-status.js";

export const familyStatusRepo = {
  async upsert(data: InsertFamilyStatus): Promise<void> {
    const sql = await client
      .insert(familyStatus)
      .values(data)
      .onConflictDoUpdate({
        target: familyStatus.subjectId,
        set: data,
      })
      .returning();

    // eslint-disable-next-line no-console
    console.log(sql); // stampi la query
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
