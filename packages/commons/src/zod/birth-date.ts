import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { BirthDate } from "../db/schema/family-status/birth-date.js";
import { InsertMunicipalitySchema } from "./municipality.js";
import { InsertPlaceSchema } from "./place.js";

export const InsertBirthDateSchema = createInsertSchema(BirthDate)
  .omit({ id: true, placeOfBirthId: true })
  .extend({
    placeOfBirth: z.object({
      municipality: InsertMunicipalitySchema,
      place: InsertPlaceSchema,
    }),
  });
