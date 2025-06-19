import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { BirthDate } from "./birth-date.js";

export const Criteria = customSchema.table("criteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: text("subject_id"),
  personalId: text("personal_id"),
  surname: text("surname"),
  nosurname: text("nosurname"),
  name: text("name"),
  noname: text("noname"),
  gender: text("gender"),
  birthDateId: uuid("birth_date_id").references(() => BirthDate.id),
});
