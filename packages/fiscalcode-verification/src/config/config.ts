import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  SslConfig,
  ContextConfig,
  LoggerConfig,
  SkipDigestConfig,
} from "pdnd-common";

export const FiscalcodeVerificationConfig = DatabaseConfig.and(HTTPServerConfig)
  .and(SslConfig)
  .and(SignerConfig)
  .and(ContextConfig)
  .and(SkipDigestConfig)
  .and(LoggerConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
