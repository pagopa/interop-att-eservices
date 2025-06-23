import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { client } from "../../db/postgres/client.js";
import {
  Municipalities,
  Places,
  BirthDate,
  Criteria,
  CompleteSubjectBinding,
} from "../../db/schema/family-status/index.js";

import { FamilyStatusInputSchema } from "../../zod/family-status.js";

export class FamilyStatusPreparationService {
  public static async insert(
    input: z.infer<typeof FamilyStatusInputSchema>
  ): Promise<{
    municipality: typeof Municipalities.$inferInsert;
    place: typeof Places.$inferInsert;
    birthDate: typeof BirthDate.$inferInsert;
    criteria: typeof Criteria.$inferInsert;
    binding: typeof CompleteSubjectBinding.$inferInsert;
  }> {
    return client.transaction(async (tx) => {
      if (!input.subject) {
        throw new Error("Missing 'subject' in input");
      }
      const {
        subject: {
          subjectId,
          personalId,
          surname,
          nosurname,
          name,
          noname,
          gender,
          birthDate: {
            eventDate,
            noDay,
            noMonth,
            placeOfBirth: { municipality, place },
          },
        },
        subjectLink,
      } = input;

      const [municipalityResult] = await tx
        .insert(Municipalities)
        .values({
          id: uuid(),
          ...municipality,
        })
        .returning();

      const [placeResult] = await tx
        .insert(Places)
        .values({
          id: uuid(),
          ...place,
        })
        .returning();

      const [birthDateResult] = await tx
        .insert(BirthDate)
        .values({
          id: uuid(),
          eventDate,
          noDay,
          noMonth,
          placeOfBirthId: placeResult.id,
        })
        .returning();

      const [criteriaResult] = await tx
        .insert(Criteria)
        .values({
          id: uuid(),
          subjectId,
          personalId,
          surname,
          nosurname,
          name,
          noname,
          gender,
          birthDateId: birthDateResult.id,
        })
        .returning();

      const [bindingResult] = await tx
        .insert(CompleteSubjectBinding)
        .values({
          id: uuid(),
          ...subjectLink,
        })
        .returning();

      return {
        municipality: municipalityResult,
        place: placeResult,
        birthDate: birthDateResult,
        criteria: criteriaResult,
        binding: bindingResult,
      };
    });
  }

  public static async selectBySubjectId(subjectId: string): Promise<
    | {
        criteria: typeof Criteria.$inferSelect;
        birthDate: typeof BirthDate.$inferSelect;
        municipality: typeof Municipalities.$inferSelect;
        place: typeof Places.$inferSelect;
        binding: typeof CompleteSubjectBinding.$inferSelect;
      }
    | undefined
  > {
    return client
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
        eq(CompleteSubjectBinding.id, Criteria.id)
      )
      .where(eq(Criteria.subjectId, subjectId))
      .limit(1)
      .then((results) => {
        const row = results[0];
        if (
          !row?.criteria ||
          !row?.birthDate ||
          !row?.municipality ||
          !row?.place ||
          !row?.binding
        ) {
          return undefined;
        }
        return {
          criteria: row.criteria,
          birthDate: row.birthDate,
          municipality: row.municipality,
          place: row.place,
          binding: row.binding,
        };
      });
  }
}
