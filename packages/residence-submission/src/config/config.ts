import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShClientConfig,
  M2mConfig,
  InteroperabilityConfig,
  JWTConfig,
  ShConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const ResidenceSubmissionConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(InteroperabilityConfig)
  .and(JWTConfig)
  .and(ShConfig)
  .and(HTTPServerConfig);

export type ResidenceSubmissionConfig = z.infer<
  typeof ResidenceSubmissionConfig
>;

export const residenceSubmissionConfig: ResidenceSubmissionConfig =
  ResidenceSubmissionConfig.parse(process.env);
