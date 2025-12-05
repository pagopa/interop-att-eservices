import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
} from "pdnd-common";

export const ResidenceVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(JWTConfig);

export type ResidenceVerificationConfig = z.infer<
  typeof ResidenceVerificationConfig
>;

export const residenceVerificationConfig: ResidenceVerificationConfig =
  ResidenceVerificationConfig.parse(process.env);
