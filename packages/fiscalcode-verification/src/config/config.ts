import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  SslConfig,
  ContextConfig,
  LoggerConfig,
  JWTConfig,
  KeychainSignerConfig,
} from "pdnd-common";

export const FiscalcodeVerificationConfig = DatabaseConfig.and(HTTPServerConfig)
  .and(SslConfig)
  .and(KeychainSignerConfig)
  .and(SignerConfig)
  .and(ContextConfig)
  .and(JWTConfig)
  .and(LoggerConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
