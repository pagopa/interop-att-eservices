import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
} from "pdnd-common";

const TrialServiceSpecificConfig = z
  .object({
    SKIP_JWT_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
    WELL_KNOWN_URLS: z.string().optional(),
  })
  .transform((env) => ({
    skipJwtVerification: env.SKIP_JWT_VERIFICATION,
    wellKnownUrls: env.WELL_KNOWN_URLS,
  }));

export const TrialServiceConfig = LoggerConfig.and(DatabaseConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(TrialServiceSpecificConfig);

export type TrialServiceConfig = z.infer<typeof TrialServiceConfig>;

export const trialServiceConfig: TrialServiceConfig = TrialServiceConfig.parse(
  process.env
);
