import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  ShClientConfig,
  M2mConfig,
  SignerConfig,
  JWTConfig,
} from "pdnd-common";

export const DigitalAddressVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(M2mConfig)
  .and(SignerConfig)
  .and(ShClientConfig)
  .and(JWTConfig);

export type DigitalAddressVerificationConfig = z.infer<
  typeof DigitalAddressVerificationConfig
>;

export const digitalAddressVerificationConfig: DigitalAddressVerificationConfig =
  DigitalAddressVerificationConfig.parse(process.env);
