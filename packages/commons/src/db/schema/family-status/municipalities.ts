import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const Municipalities = customSchema.table("municipalities", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameMunicipality: text("name_municipality"),
  istatCode: text("istat_code"),
  acronymIstatProvince: text("acronym_istat_province"),
  placeDescription: text("place_description"),
});
