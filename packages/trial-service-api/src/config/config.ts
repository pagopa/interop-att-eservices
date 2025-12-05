import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
} from "pdnd-common";

export const TrialServiceConfig = LoggerConfig.and(DatabaseConfig)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(JWTConfig);

export type TrialServiceConfig = z.infer<typeof TrialServiceConfig>;

export const trialServiceConfig: TrialServiceConfig = TrialServiceConfig.parse(
  process.env
);
