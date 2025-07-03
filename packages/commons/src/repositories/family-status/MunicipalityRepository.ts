import { v4 as uuid } from "uuid";
import { Municipalities } from "../../db/schema/family-status/index.js";
import { DBClient } from "../../types/db.js";

export class MunicipalityRepository {
  public async insert(
    data: Omit<typeof Municipalities.$inferInsert, "id">,
    db: DBClient
  ): Promise<typeof Municipalities.$inferInsert> {
    const [result] = await db
      .insert(Municipalities)
      .values({ id: uuid(), ...data })
      .returning();

    if (!result) {
      throw new Error("Failed to insert municipality");
    }

    return result;
  }
}
