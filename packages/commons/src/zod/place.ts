import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Places } from "../db/schema/family-status/places.js";

export const InsertPlaceSchema = createInsertSchema(Places);
export const SelectPlaceSchema = createSelectSchema(Places);
