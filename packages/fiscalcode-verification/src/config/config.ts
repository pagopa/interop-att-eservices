import { z } from "zod";
import { DatabaseConfig, HTTPServerConfig, SslConfig } from "pdnd-common";

export const FiscalcodeVerificationConfig =
  DatabaseConfig.and(HTTPServerConfig).and(SslConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
