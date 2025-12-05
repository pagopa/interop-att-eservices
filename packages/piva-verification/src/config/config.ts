import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  JWTConfig,
  HandShakesConfig,
} from "pdnd-common";

export const FiscalcodeVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(SignerConfig)
  .and(JWTConfig)
  .and(HandShakesConfig);

export type FiscalcodeVerificationConfig = z.infer<
  typeof FiscalcodeVerificationConfig
>;

export const fiscalcodeVerificationConfig: FiscalcodeVerificationConfig =
  FiscalcodeVerificationConfig.parse(process.env);
