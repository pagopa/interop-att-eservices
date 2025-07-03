import { v4 as uuid } from "uuid";
import { Places } from "../../db/schema/family-status/index.js";
import { DBClient } from "../../types/db.js";

export class PlaceRepository {
  public async insert(
    data: Omit<typeof Places.$inferInsert, "id">,
    db: DBClient
  ): Promise<typeof Places.$inferInsert> {
    const [result] = await db
      .insert(Places)
      .values({ id: uuid(), ...data })
      .returning();
    return result;
  }
}
