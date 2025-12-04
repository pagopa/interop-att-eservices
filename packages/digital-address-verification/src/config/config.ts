import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  ShClientConfig,
  M2mConfig,
  SignerConfig,
} from "pdnd-common";

const DigitalAddressSpecificConfig = z
  .object({
    SKIP_JWT_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
    WELL_KNOWN_URLS: z.string().optional(),

    SKIP_AGID_PAYLOAD_VERIFICATION: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
  })
  .transform((env) => ({
    skipJwtVerification: env.SKIP_JWT_VERIFICATION,
    wellKnownUrls: env.WELL_KNOWN_URLS,
    skipAgidPayloadVerification: env.SKIP_AGID_PAYLOAD_VERIFICATION,
  }));

export const DigitalAddressVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(M2mConfig)
  .and(SignerConfig)
  .and(ShClientConfig)
  .and(DigitalAddressSpecificConfig);

export type DigitalAddressVerificationConfig = z.infer<
  typeof DigitalAddressVerificationConfig
>;

export const digitalAddressVerificationConfig: DigitalAddressVerificationConfig =
  DigitalAddressVerificationConfig.parse(process.env);
