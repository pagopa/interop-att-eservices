import { createInsertSchema } from "drizzle-zod";
import { Municipalities } from "../db/schema/family-status/municipalities.js";

export const InsertMunicipalitySchema = createInsertSchema(Municipalities).omit(
  {
    id: true,
  }
);
