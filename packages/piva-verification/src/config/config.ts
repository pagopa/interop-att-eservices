import { z } from "zod";
import {
  LoggerConfig,
  DatabaseConfig,
  HTTPServerConfig,
  SignerConfig,
  JWTConfig,
  SslConfig,
  ShConfig,
  M2mConfig,
  ContextConfig,
  ShClientConfig,
} from "pdnd-common";

export const PivaVerificationConfig = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(SignerConfig)
  .and(JWTConfig)
  .and(SslConfig)
  .and(ShConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(ContextConfig);

export type PivaVerificationConfig = z.infer<typeof PivaVerificationConfig>;

export const pivaVerificationConfig: PivaVerificationConfig =
  PivaVerificationConfig.parse(process.env);
