import { v4 as uuid } from "uuid";
import { BirthDate } from "../../db/schema/family-status/index.js";
import { DBClient } from "../../types/db.js";

export class BirthDateRepository {
  public async insert(
    data: Omit<typeof BirthDate.$inferInsert, "id">,
    db: DBClient
  ): Promise<typeof BirthDate.$inferInsert> {
    const [result] = await db
      .insert(BirthDate)
      .values({ id: uuid(), ...data })
      .returning({ id: BirthDate.id });

    if (!result) {
      throw new Error("Insert failed: BirthDate");
    }
    return result;
  }
}
