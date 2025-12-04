import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
} from "pdnd-common";

const ResidenceVerificationDirectSpecificConfig = z
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

export const ResidenceVerificationDirectConfig = LoggerConfig.and(
  DatabaseConfig
)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ResidenceVerificationDirectSpecificConfig);

export type ResidenceVerificationDirectConfig = z.infer<
  typeof ResidenceVerificationDirectConfig
>;

export const residenceVerificationDirectConfig: ResidenceVerificationDirectConfig =
  ResidenceVerificationDirectConfig.parse(process.env);
