import { z } from "zod";
import {
  DatabaseConfig,
  HTTPServerConfig,
  KeychainSignerConfig,
  LoggerConfig,
  SslConfig,
  JWTConfig,
  ContextConfig,
  InteroperabilityConfig,
} from "pdnd-common";

export const FamilyStatusConfiguration = LoggerConfig.and(DatabaseConfig)
  .and(HTTPServerConfig)
  .and(KeychainSignerConfig)
  .and(SslConfig)
  .and(JWTConfig)
  .and(ContextConfig)
  .and(InteroperabilityConfig);

export type FamilyStatusConfiguration = z.infer<
  typeof FamilyStatusConfiguration
>;

export const familyStatusConfiguration: FamilyStatusConfiguration =
  FamilyStatusConfiguration.parse(process.env);
