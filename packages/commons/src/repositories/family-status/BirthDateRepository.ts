import { v4 as uuid } from "uuid";
import { BirthDate } from "../../db/schema/family-status/index.js";
import { client } from "../../db/postgres/client.js";
import { DBClient } from "../../types/db.js";

export class BirthDateRepository {
  public async insert(
    data: Omit<typeof BirthDate.$inferInsert, "id">,
    db: DBClient = client
  ): Promise<typeof BirthDate.$inferSelect> {
    const [result] = await db
      .insert(BirthDate)
      .values({ id: uuid(), ...data })
      .returning();
    if (!result) {
      throw new Error("Insert failed");
    }
    return result;
  }
}
