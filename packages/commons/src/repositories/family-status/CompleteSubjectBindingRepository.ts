import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js";
import {
  type CompleteSubjectBindingSelect,
  type CompleteSubjectBindingInsert,
  CompleteSubjectBinding,
} from "../../db/schema/family-status/subject-binding.js";
import { DBClient } from "../../types/db.js";

export class CompleteSubjectBindingRepository {
  public async insert(
    data: CompleteSubjectBindingInsert,
    db: DBClient = client
  ): Promise<CompleteSubjectBindingSelect> {
    const [result] = await db
      .insert(CompleteSubjectBinding)
      .values(data)
      .returning();
    if (!result) {
      throw new Error("Insert failed");
    }
    return result;
  }

  public async findBySubjectId(
    subjectId: string,
    db: DBClient = client
  ): Promise<CompleteSubjectBindingSelect | undefined> {
    return db
      .select()
      .from(CompleteSubjectBinding)
      .where(eq(CompleteSubjectBinding.subjectId, subjectId))
      .then((rows) => rows[0]);
  }

  public async updateBySubjectId(
    subjectId: string,
    data: Partial<CompleteSubjectBindingInsert>
  ): Promise<unknown> {
    return client
      .update(CompleteSubjectBinding)
      .set(data)
      .where(eq(CompleteSubjectBinding.subjectId, subjectId));
  }
}
