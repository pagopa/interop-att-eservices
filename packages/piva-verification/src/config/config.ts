import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  JWTConfig,
  SslConfig,
  ContextConfig,
  SkipDigestConfig,
} from "pdnd-common";

export const PivaVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(SignerConfig)
  .and(JWTConfig)
  .and(SslConfig)
  .and(SkipDigestConfig)
  .and(ContextConfig);

export type PivaVerificationConfig = z.infer<typeof PivaVerificationConfig>;

export const pivaVerificationConfig: PivaVerificationConfig =
  PivaVerificationConfig.parse(process.env);
