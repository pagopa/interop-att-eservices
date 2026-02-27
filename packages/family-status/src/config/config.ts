import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
  KeychainSignerConfig,
  LoggerConfig,
  SslConfig,
  JWTConfig,
  ContextConfig,
  ShConfig,
  ShClientConfig,
  M2mConfig,
  InteroperabilityConfig,
} from "pdnd-common";

export const FamilyStatusConfiguration = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(KeychainSignerConfig)
  .and(SslConfig)
  .and(JWTConfig)
  .and(ContextConfig)
  .and(ShConfig)
  .and(ShClientConfig)
  .and(M2mConfig)
  .and(InteroperabilityConfig);

export type FamilyStatusConfiguration = z.infer<
  typeof FamilyStatusConfiguration
>;

export const familyStatusConfiguration: FamilyStatusConfiguration =
  FamilyStatusConfiguration.parse(process.env);
