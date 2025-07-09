import { z } from "zod";
import { InsertCriteriaSchema, SelectCriteriaSchema } from "./criteria.js";
import { InsertBirthDateSchema, SelectBirthDateSchema } from "./birth-date.js";
import {
  InsertMunicipalitySchema,
  SelectMunicipalitySchema,
} from "./municipality.js";
import { InsertPlaceSchema, SelectPlaceSchema } from "./place.js";
import { InsertBindingSchema, SelectBindingSchema } from "./binding.js";

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

export const FamilyStatusResponseSchema = z.object({
  criteria: SelectCriteriaSchema.omit({ id: true, birthDateId: true }),

  birthDate: SelectBirthDateSchema.pick({
    eventDate: true,
    noDay: true,
    noMonth: true,
  }),

  placeOfBirth: SelectPlaceSchema.pick({
    placeDescription: true,
    countryDescription: true,
    codState: true,
    provinceCounty: true,
  }).extend({
    municipality: SelectMunicipalitySchema,
  }),

  relationship: SelectBindingSchema.pick({
    relationshipType: true,
    relationshipCode: true,
    startDate: true,
    startDateRelationship: true,
    memberSequence: true,
  }).nullable(),
});
