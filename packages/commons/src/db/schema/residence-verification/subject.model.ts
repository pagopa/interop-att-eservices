import { text, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { customSchema } from "../schema.js";
import { addressTable } from "./address.model.js";

export const subjectTable = customSchema.table("subjects", {
  uuid: uuid("uuid").primaryKey(),
  id: text("id").notNull(),
  subject_id: text("subject_id").notNull(),

  surname: text("surname"),
  name: text("name"),
  gender: text("gender"),
  birth_event_date: text("birth_event_date"),
  birth_exceptional_place: text("birth_exceptional_place"),
  birth_municipality_name: text("birth_municipality_name"),
  birth_municipality_istat_code: text("birth_municipality_istat_code"),
  birth_municipality_acronym_istat_province: text(
    "birth_municipality_acronym_istat_province"
  ),
  birth_municipality_place_description: text(
    "birth_municipality_place_description"
  ),
  birth_place_description: text("birth_place_description"),
  birth_country_description: text("birth_country_description"),
  birth_cod_state: text("birth_cod_state"),
  birth_province_county: text("birth_province_county"),

  address_id: uuid("address_id")
    .notNull()
    .references(() => addressTable.id),
});

export type Subject = InferSelectModel<typeof subjectTable>;
