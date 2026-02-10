import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  SslConfig,
  ContextConfig,
  LoggerConfig,
  ShConfig,
  M2mConfig,
  ShClientConfig,
  KeychainSignerConfig
} from "pdnd-common";

export const FiscalcodeVerificationConfig = DatabaseConfig.and(HTTPServerConfig)
  .and(SslConfig)
  .and(KeychainSignerConfig)
  .and(SignerConfig)
  .and(ContextConfig)
  .and(ShConfig)
  .and(M2mConfig)
  .and(ShClientConfig)
  .and(LoggerConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
