import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import {
  Criteria,
  BirthDate,
  Municipalities,
  Places,
  CompleteSubjectBinding,
} from "../../db/schema/family-status/index.js";
import { client } from "../../db/postgres/client.js";
import { DBClient } from "../../types/db.js";

export class CriteriaRepository {
  public async insert(
    data: Omit<typeof Criteria.$inferInsert, "id">,
    db: DBClient = client
  ): Promise<typeof Criteria.$inferInsert> {
    const [result] = await db
      .insert(Criteria)
      .values({ id: uuid(), ...data })
      .returning({ id: Criteria.id });

    if (!result) {
      throw new Error("Insert failed: Criteria");
    }
    return result;
  }

  public async findWithJoinsBySubjectId(subjectId: string): Promise<
    | {
        criteria: typeof Criteria.$inferSelect;
        birthDate: typeof BirthDate.$inferSelect | null;
        municipality: typeof Municipalities.$inferSelect | null;
        place: typeof Places.$inferSelect | null;
        binding: typeof CompleteSubjectBinding.$inferSelect | null;
      }
    | undefined
  > {
    const [row] = await client
      .select({
        criteria: Criteria,
        birthDate: BirthDate,
        municipality: Municipalities,
        place: Places,
        binding: CompleteSubjectBinding,
      })
      .from(Criteria)
      .leftJoin(BirthDate, eq(Criteria.birthDateId, BirthDate.id))
      .leftJoin(Places, eq(BirthDate.placeOfBirthId, Places.id))
      .leftJoin(Municipalities, eq(Places.id, Municipalities.id))
      .leftJoin(
        CompleteSubjectBinding,
        eq(CompleteSubjectBinding.subjectId, Criteria.subjectId)
      )
      .where(eq(Criteria.subjectId, subjectId))
      .limit(1);

    return row;
  }

  public async findAllWithJoins(): Promise<
    Array<{
      criteria: typeof Criteria.$inferSelect;
      birthDate: typeof BirthDate.$inferSelect | null;
      place: typeof Places.$inferSelect | null;
      binding: typeof CompleteSubjectBinding.$inferSelect | null;
    }>
  > {
    return await client
      .select({
        criteria: Criteria,
        birthDate: BirthDate,
        place: Places,
        binding: CompleteSubjectBinding,
      })
      .from(Criteria)
      .leftJoin(BirthDate, eq(Criteria.birthDateId, BirthDate.id))
      .leftJoin(Places, eq(BirthDate.placeOfBirthId, Places.id))
      .leftJoin(
        CompleteSubjectBinding,
        eq(Criteria.subjectId, CompleteSubjectBinding.subjectId)
      );
  }
}
