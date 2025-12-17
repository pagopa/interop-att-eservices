import { z } from "zod";

export const ShConfig = z
  .object({
    SEED_EXPIRATION_DAYS: z.coerce.number().int().positive(),
    SALT_LENGTH: z.coerce.number().int().min(1),
    ALGORITHM: z.string().min(1),
    START_DATE_MS: z.string(),
  })
  .transform((c) => ({
    seedExpireDays: c.SEED_EXPIRATION_DAYS,
    saltLength: c.SALT_LENGTH,
    algorithm: c.ALGORITHM,
    startDateMs: c.START_DATE_MS,
  }));

export type ShConfig = z.infer<typeof ShConfig>;
