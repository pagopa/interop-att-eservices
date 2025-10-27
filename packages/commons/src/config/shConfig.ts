import { z } from "zod";

export const ShConfig = z
  .object({
    SEED_EXPIRATION_DAYS: z.coerce.number().int().positive(),
    SALT_LENGTH: z.coerce.number().int().min(1),
    ALGORITHM: z.string().min(1),
  })
  .transform((c) => ({
    seedExpireDays: c.SEED_EXPIRATION_DAYS,
    saltLength: c.SALT_LENGTH,
    algorithm: c.ALGORITHM,
  }));

export type ShConfig = z.infer<typeof ShConfig>;

export const shConfig: () => ShConfig = () => ShConfig.parse(process.env);
