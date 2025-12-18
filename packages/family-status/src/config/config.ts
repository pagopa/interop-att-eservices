import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
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
