import { z } from "zod";

export const ShConfig = z
  .object({
    SEED_EXPIRATION_DAYS: z.number(),
    SALT_LENGTH: z.number(),
    ALGORITHM: z.string(),
  })
  .transform((c) => ({
    seedExpireDays: c.SEED_EXPIRATION_DAYS,
    saltLength: c.SALT_LENGTH,
    algorithm: c.ALGORITHM,
  }));

export type ShConfig = z.infer<typeof ShConfig>;

export const shConfig: () => ShConfig = () => ShConfig.parse(process.env);
