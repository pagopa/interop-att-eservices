import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { Places } from "./places.js";
import { Municipalities } from "./municipalities.js";

export const DataBirth = customSchema.table("data_birth", {
  id: uuid("id").defaultRandom().primaryKey(),
  exceptionalPlace: text("exceptional_place"),
  municipalityId: uuid("municipality_id").references(() => Municipalities.id),
  placeId: uuid("place_id").references(() => Places.id),
});
