import { z } from "zod";

export const rawPayloadSchema = z.object({
  subject: z.object({
    id: z.string().uuid(),
    subjectId: z.string().max(16),
    surname: z.string(),
    name: z.string(),
    gender: z.string().length(1),
    birthDate: z
      .object({
        eventDate: z.string().min(1),
        placeOfBirth: z
          .object({
            municipality: z
              .object({
                nameMunicipality: z.string(),
                istatCode: z.string(),
                acronymIstatProvince: z.string(),
                placeDescription: z.string(),
              })
              .optional(),
            place: z
              .object({
                placeDescription: z.string(),
                countryDescription: z.string(),
                codState: z.string(),
                provinceCounty: z.string(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  }),
  subjectLink: z
    .object({
      relationshipType: z.string().optional(),
      startDate: z.string().optional(),
      relationshipCode: z.string().optional(),
      memberSequence: z.string().optional(),
      startDateRelationship: z.string().optional(),
      endDateRelationship: z.string().optional(),
    })
    .optional(),
});

export type RawPayload = z.infer<typeof rawPayloadSchema>;
