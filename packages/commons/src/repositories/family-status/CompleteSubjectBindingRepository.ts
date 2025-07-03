import { v4 as uuid } from "uuid";
import { CompleteSubjectBinding } from "../../db/schema/family-status/index.js";
import { DBClient } from "../../types/db.js";

export class CompleteSubjectBindingRepository {
  public async insert(
    data: Omit<typeof CompleteSubjectBinding.$inferInsert, "id">,
    db: DBClient
  ): Promise<typeof CompleteSubjectBinding.$inferInsert> {
    const [result] = await db
      .insert(CompleteSubjectBinding)
      .values({ id: uuid(), ...data })
      .returning({ id: CompleteSubjectBinding.id });

    if (!result) {
      throw new Error("Insert failed: CompleteSubjectBinding");
    }
    return result;
  }
}
