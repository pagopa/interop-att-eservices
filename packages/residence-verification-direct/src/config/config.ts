import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
} from "pdnd-common";

export const ResidenceVerificationDirectConfig = LoggerConfig.and(
  DatabaseConfig
)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(JWTConfig);

export type ResidenceVerificationDirectConfig = z.infer<
  typeof ResidenceVerificationDirectConfig
>;

export const residenceVerificationDirectConfig: ResidenceVerificationDirectConfig =
  ResidenceVerificationDirectConfig.parse(process.env);
