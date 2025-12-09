import {
  InteroperabilityConfig,
  JWTConfig,
  LoggerConfig,
  M2mConfig,
  SignerConfig,
} from "pdnd-common";
import { z } from "zod";

export const ShConfig = z
  .object({
    SEED_EXPIRATION_DAYS: z.coerce.number().int().positive(),
    SALT_LENGTH: z.coerce.number().int().min(1),
    ALGORITHM: z.string().min(1),
    START_DATE_MS: z.string(),
    SIGNAL_HUB_HOST: z.string().url(),
    SIGNAL_HUB_API_VERSION: z.string().min(1),
    CRON_TIME_JOB: z
      .string()
      .min(1, "CRON_TIME_JOB is required")
      .regex(
        /^(\S+\s+){5}\S+$/,
        "CRON_TIME_JOB must be a 6-field cron expression"
      ),
  })
  .transform((c) => ({
    seedExpireDays: c.SEED_EXPIRATION_DAYS,
    saltLength: c.SALT_LENGTH,
    algorithm: c.ALGORITHM,
    startDateMs: c.START_DATE_MS,
    signalHubHost: c.SIGNAL_HUB_HOST,
    signalHubApiVersion: c.SIGNAL_HUB_API_VERSION,
    cronTime: c.CRON_TIME_JOB,
  }))
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(JWTConfig)
  .and(LoggerConfig)
  .and(M2mConfig);

export type ShConfig = z.infer<typeof ShConfig>;

export const shConfig: ShConfig = ShConfig.parse(process.env);
