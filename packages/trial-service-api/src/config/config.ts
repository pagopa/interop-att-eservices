import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
  ContextConfig,
} from "pdnd-common";

export const TrialServiceConfig = LoggerConfig.and(DatabaseConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ContextConfig)
  .and(JWTConfig);

export type TrialServiceConfig = z.infer<typeof TrialServiceConfig>;

export const trialServiceConfig: TrialServiceConfig = TrialServiceConfig.parse(
  process.env
);
