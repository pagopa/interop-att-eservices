import { z } from "zod";

const normalizedKeychainEnv = z.preprocess(
  (env) => {
    const input = env as Record<string, unknown>;

    return {
      ...input,
      KMS_KEYCHAIN_LOCAL_CONFIG: input.KMS_KEYCHAIN_LOCAL_CONFIG ?? "false",
    };
  },

  z
    .discriminatedUnion("KMS_KEYCHAIN_LOCAL_CONFIG", [
      z.object({
        KMS_KEYCHAIN_LOCAL_CONFIG: z.literal("true"),
        KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
        KMS_KEYID: z.string(),
        KMS_KEYCHAIN_PUBLICKEY_KID: z.string(),
        KMS_KEYCHAIN_ENDPOINT: z.string(),
        KMS_KEYCHAIN_REGION: z.string(),
        KMS_KEYCHAIN_ACCESS_KEYID: z.string(),
        KMS_KEYCHAIN_SECRET_ACCESS_KEYID: z.string(),
      }),
      z.object({
        KMS_KEYCHAIN_LOCAL_CONFIG: z.literal("false"),
        KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
        KMS_KEYCHAIN_PUBLICKEY_KID: z.string(),
        KMS_KEYID: z.string(),
        KMS_KEYCHAIN_ENDPOINT: z.undefined(),
        KMS_KEYCHAIN_REGION: z.string(),
        KMS_KEYCHAIN_ACCESS_KEYID: z.string(),
        KMS_KEYCHAIN_SECRET_ACCESS_KEYID: z.string(),
      }),
    ])
    .transform((cfg) => ({
      maxAcquisitionTimeoutSeconds:
        cfg.KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS,

      kmsKeychainKeyId: cfg.KMS_KEYID,
      keychainPublicKeyKid: cfg.KMS_KEYCHAIN_PUBLICKEY_KID,

      kmsKeychainEndpoint: cfg.KMS_KEYCHAIN_ENDPOINT,
      localKeychainConfig: cfg.KMS_KEYCHAIN_LOCAL_CONFIG === "true",

      kmsRegion: cfg.KMS_KEYCHAIN_REGION,
      kmsAccessKeyId: cfg.KMS_KEYCHAIN_ACCESS_KEYID,
      kmsAccessKeySecret: cfg.KMS_KEYCHAIN_SECRET_ACCESS_KEYID,
    }))
);

export const KeychainSignerConfig = normalizedKeychainEnv;
export type KeychainSignerConfig = z.infer<typeof KeychainSignerConfig>;

export const keychainSignerConfig = (): KeychainSignerConfig =>
  KeychainSignerConfig.parse(process.env);
