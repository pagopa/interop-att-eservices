import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShClientConfig,
  M2mConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
  ContextConfig,
} from "pdnd-common";

export const ResidenceSubmissionConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ContextConfig)
  .and(JWTConfig);

export type ResidenceSubmissionConfig = z.infer<
  typeof ResidenceSubmissionConfig
>;

export const residenceSubmissionConfig: ResidenceSubmissionConfig =
  ResidenceSubmissionConfig.parse(process.env);
