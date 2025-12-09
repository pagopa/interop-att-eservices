import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  SignerConfig,
  InteroperabilityConfig,
  JWTConfig,
  ContextConfig,
  HTTPServerConfig,
} from "pdnd-common";

export const ResidenceVerificationDirectConfig = LoggerConfig.and(
  DatabaseConfig
)
  .and(SignerConfig)
  .and(InteroperabilityConfig)
  .and(ContextConfig)
  .and(JWTConfig)
  .and(HTTPServerConfig);

export type ResidenceVerificationDirectConfig = z.infer<
  typeof ResidenceVerificationDirectConfig
>;

export const residenceVerificationDirectConfig: ResidenceVerificationDirectConfig =
  ResidenceVerificationDirectConfig.parse(process.env);
