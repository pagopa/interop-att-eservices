import { z } from "zod";

export const ShClientConfig = z
  .object({
    SIGNAL_HUB_HOST: z.string().url(),
    SIGNAL_HUB_API_VERSION: z.string().min(1),

    SEED_EXPIRATION_DAYS: z.coerce.number().min(1),
    SALT_LENGTH: z.coerce.number().min(1),
    ALGORITHM: z.string(),
  })
  .transform((c) => ({
    signalHubHost: c.SIGNAL_HUB_HOST,
    signalHubApiVersion: c.SIGNAL_HUB_API_VERSION,
    seedExpireDays: c.SEED_EXPIRATION_DAYS,
    saltLength: c.SALT_LENGTH,
    algorithm: c.ALGORITHM,
  }));

export type ShClientConfig = z.infer<typeof ShClientConfig>;

export const shClientMock: () => ShClientConfig = () =>
  ShClientConfig.parse(process.env);
