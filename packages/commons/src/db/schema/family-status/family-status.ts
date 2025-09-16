import { varchar, text, date, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const familyStatus = customSchema.table("family_status", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  id: varchar("id", { length: 64 }).notNull(),

  subjectId: varchar("subjectId", { length: 16 }).notNull().unique(),
  surname: text("surname").notNull(),
  name: text("name").notNull(),
  gender: varchar("gender", { length: 1 }),
  birthDate: date("birthDate"),

  municipality_nameMunicipality: text("municipality_nameMunicipality"),
  municipality_istatCode: text("municipality_istatCode"),
  municipality_acronymIstatProvince: text("municipality_acronymIstatProvince"),
  municipality_placeDescription: text("municipality_placeDescription"),

  place_placeDescription: text("place_placeDescription"),
  place_countryDescription: text("place_countryDescription"),
  place_codState: text("place_codState"),
  place_provinceCounty: text("place_provinceCounty"),

  relationshipType: text("relationshipType"),
  startDate: date("startDate"),
  relationshipCode: text("relationshipCode"),
  memberSequence: text("memberSequence"),
  startDateRelationship: date("startDateRelationship"),
  endDateRelationship: date("endDateRelationship"),
});
