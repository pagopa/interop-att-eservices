import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const Places = customSchema.table("places", {
  id: uuid("id").defaultRandom().primaryKey(),
  placeDescription: text("place_description"),
  countryDescription: text("country_description"),
  codState: text("cod_state"),
  provinceCounty: text("province_county"),
});
