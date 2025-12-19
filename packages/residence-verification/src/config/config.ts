import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  ShConfig,
  InteroperabilityConfig,
  ContextConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const ResidenceVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(ShConfig)
  .and(ContextConfig)
  .and(InteroperabilityConfig)
  .and(HTTPServerConfig);

export type ResidenceVerificationConfig = z.infer<
  typeof ResidenceVerificationConfig
>;

export const residenceVerificationConfig: ResidenceVerificationConfig =
  ResidenceVerificationConfig.parse(process.env);
