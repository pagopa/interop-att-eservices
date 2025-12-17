import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  ShClientConfig,
  M2mConfig,
  JWTConfig,
  ContextConfig,
  InteroperabilityConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const DigitalAddressVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(M2mConfig)
  .and(ShClientConfig)
  .and(ContextConfig)
  .and(HTTPServerConfig)
  .and(JWTConfig)
  .and(InteroperabilityConfig);

export type DigitalAddressVerificationConfig = z.infer<
  typeof DigitalAddressVerificationConfig
>;

export const digitalAddressVerificationConfig: DigitalAddressVerificationConfig =
  DigitalAddressVerificationConfig.parse(process.env);
