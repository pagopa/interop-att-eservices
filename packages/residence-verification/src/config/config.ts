import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  SignerConfig,
  InteroperabilityConfig,
} from "pdnd-common";

const ResidenceSpecificConfig = z
  .object({
    SKIP_JWT_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
    WELL_KNOWN_URLS: z.string().optional(),

    SKIP_INTEROPERABILITY_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
    SKIP_AGID_PAYLOAD_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
  })
  .transform((env) => ({
    skipJwtVerification: env.SKIP_JWT_VERIFICATION,
    wellKnownUrls: env.WELL_KNOWN_URLS,
    skipInteroperabilityVerification: env.SKIP_INTEROPERABILITY_VERIFICATION,
    skipAgidPayloadVerification: env.SKIP_AGID_PAYLOAD_VERIFICATION,
  }));

export const ResidenceVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ResidenceSpecificConfig);

export type ResidenceVerificationConfig = z.infer<
  typeof ResidenceVerificationConfig
>;

export const residenceVerificationConfig: ResidenceVerificationConfig =
  ResidenceVerificationConfig.parse(process.env);
