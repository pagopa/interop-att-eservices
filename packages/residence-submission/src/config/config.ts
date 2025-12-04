import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShClientConfig,
  M2mConfig,
  SignerConfig,
} from "pdnd-common";

const ResidenceSubmissionSpecificConfig = z
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

export const ResidenceSubmissionConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(SignerConfig)
  .and(ResidenceSubmissionSpecificConfig);

export type ResidenceSubmissionConfig = z.infer<
  typeof ResidenceSubmissionConfig
>;

export const residenceSubmissionConfig: ResidenceSubmissionConfig =
  ResidenceSubmissionConfig.parse(process.env);
