import { z } from "zod";
import { InsertCriteriaSchema } from "./criteria.js";
import { InsertBirthDateSchema } from "./birth-date.js";
import { InsertMunicipalitySchema } from "./municipality.js";
import { InsertPlaceSchema } from "./place.js";
import { InsertBindingSchema } from "./binding.js";

export const FamilyStatusInputSchema = z.object({
  subject: z.object({
    ...InsertCriteriaSchema.shape,
    birthDate: z.object({
      ...InsertBirthDateSchema.shape,
      placeOfBirth: z.object({
        municipality: InsertMunicipalitySchema,
        place: InsertPlaceSchema,
      }),
    }),
  }),
  subjectLink: InsertBindingSchema,
});
