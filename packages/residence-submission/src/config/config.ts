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
  ShConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const ResidenceSubmissionConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ContextConfig)
  .and(JWTConfig)
  .and(ShConfig)
  .and(HTTPServerConfig);

export type ResidenceSubmissionConfig = z.infer<
  typeof ResidenceSubmissionConfig
>;

export const residenceSubmissionConfig: ResidenceSubmissionConfig =
  ResidenceSubmissionConfig.parse(process.env);
