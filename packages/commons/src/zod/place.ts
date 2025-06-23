import { createInsertSchema } from "drizzle-zod";
import { Places } from "../db/schema/family-status/places.js";

export const InsertPlaceSchema = createInsertSchema(Places).omit({
  id: true,
});
