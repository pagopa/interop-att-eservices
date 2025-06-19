import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { Places } from "./places.js";

export const BirthDate = customSchema.table("birth_date", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventDate: text("event_date"),
  noDay: text("no_day"),
  noMonth: text("no_month"),
  placeOfBirthId: uuid("place_of_birth_id").references(() => Places.id),
});
