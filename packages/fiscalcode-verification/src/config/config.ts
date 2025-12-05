import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  JWTConfig,
  SslConfig,
} from "pdnd-common";

export const FiscalcodeVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(SignerConfig)
  .and(JWTConfig)
  .and(SslConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
