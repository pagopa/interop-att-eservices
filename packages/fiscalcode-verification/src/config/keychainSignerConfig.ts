import { z } from "zod";

export const KeychainSignerConfig = z.preprocess(
  (c) =>
    (c as { KMS_KEYCHAIN_LOCAL_CONFIG: string | undefined })
      .KMS_KEYCHAIN_LOCAL_CONFIG === undefined
      ? { ...(c as object), KMS_KEYCHAIN_LOCAL_CONFIG: "false" }
      : c,

  z
    .discriminatedUnion("KMS_KEYCHAIN_LOCAL_CONFIG", [
      z.object({
        KMS_KEYCHAIN_LOCAL_CONFIG: z.literal("true"),
        KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
        KMS_KEYCHAIN_KEYID: z.string(),
        KMS_KEYCHAIN_ENDPOINT: z.string(),
      }),
      z.object({
        KMS_KEYCHAIN_LOCAL_CONFIG: z.literal("false"),
        KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
        KMS_KEYCHAIN_KEYID: z.string(),
        KMS_KEYCHAIN_ENDPOINT: z.undefined(),
      }),
    ])

    .transform((c) => ({
      maxAcquisitionTimeoutSeconds:
        c.KMS_KEYCHAIN_MAX_ACQUISITION_TIMEOUT_SECONDS,
      kmsKeychainKeyId: c.KMS_KEYCHAIN_KEYID,
      kmsKeychainEndpoint: c.KMS_KEYCHAIN_ENDPOINT,
      localKeychainConfig: c.KMS_KEYCHAIN_LOCAL_CONFIG,
    }))
);

export type KeychainSignerConfig = z.infer<typeof KeychainSignerConfig>;

export const keychainSignerConfig: () => KeychainSignerConfig = () =>
  KeychainSignerConfig.parse(process.env);
