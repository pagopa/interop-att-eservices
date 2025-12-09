import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  SignerConfig,
  JWTConfig,
  ContextConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const ResidenceVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(SignerConfig)
  .and(JWTConfig)
  .and(ContextConfig)
  .and(HTTPServerConfig);

export type ResidenceVerificationConfig = z.infer<
  typeof ResidenceVerificationConfig
>;

export const residenceVerificationConfig: ResidenceVerificationConfig =
  ResidenceVerificationConfig.parse(process.env);
