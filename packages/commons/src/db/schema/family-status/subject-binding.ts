import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
export const CompleteSubjectBinding = customSchema.table("subject_binding", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: text("subject_id").notNull(),
  relationshipType: text("relationship_type"),
  startDate: text("start_date"),
  relationshipCode: text("relationship_code"),
  memberSequence: text("member_sequence"),
  startDateRelationship: text("start_date_relationship"),
});

export type CompleteSubjectBindingInsert =
  typeof CompleteSubjectBinding.$inferInsert;
export type CompleteSubjectBindingSelect =
  typeof CompleteSubjectBinding.$inferSelect;
