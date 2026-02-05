import {
  SignerConfig,
  ContextConfig,
  HTTPServerConfig,
  JWTConfig,
  LoggerConfig,
  DatabaseConfig,
  KeychainSignerConfig,
} from "pdnd-common";
import { z } from "zod";

export const KeychainMockConfig = LoggerConfig.and(DatabaseConfig)
  .and(SignerConfig)
  .and(ContextConfig)
  .and(KeychainSignerConfig)
  .and(HTTPServerConfig)
  .and(JWTConfig);

export type KeychainMockConfig = z.infer<typeof KeychainMockConfig>;

export const keychainMockConfig: KeychainMockConfig = KeychainMockConfig.parse(
  process.env
);
