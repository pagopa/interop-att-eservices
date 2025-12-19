import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  JWTConfig,
  ContextConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const TrialServiceConfig = LoggerConfig.and(DatabaseConfig)
  .and(ContextConfig)
  .and(HTTPServerConfig)
  .and(JWTConfig);

export type TrialServiceConfig = z.infer<typeof TrialServiceConfig>;

export const trialServiceConfig: TrialServiceConfig = TrialServiceConfig.parse(
  process.env
);
