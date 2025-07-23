import { z } from "zod";

export const RequestFS001 = z.object({
  operationId: z.string(),
  criteria: z.object({
    subjectId: z.string().optional(),
    id: z.string().optional(),
    surname: z.string().optional(),
    name: z.string().optional(),
    gender: z.string().optional(),
    birthDate: z
      .object({
        eventDate: z.string().optional(),
        placeOfBirth: z
          .object({
            municipality: z
              .object({
                nameMunicipality: z.string().optional(),
              })
              .optional(),
            place: z
              .object({
                codState: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  }),
  requestData: z.object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  }),
});

export const ResponseFS001 = z.object({
  idOp: z.string(),
  subjects: z.object({
    subject: z.array(z.any()),
  }),
  warnings: z.array(z.any()).optional(),
});

export type RequestFS001Type = z.infer<typeof RequestFS001>;
export type ResponseFS001Type = z.infer<typeof ResponseFS001>;
