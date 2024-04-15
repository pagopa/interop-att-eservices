import { z } from "zod";

export const SignerConfig = z.preprocess(
  (c) =>
    (c as { KMS_LOCAL_CONFIG: string | undefined })
      .KMS_LOCAL_CONFIG === undefined
      ? { ...(c as object), KMS_LOCAL_CONFIG: false }
      : c,

  z
      .discriminatedUnion("KMS_LOCAL_CONFIG", [
        z.object({
          KMS_LOCAL_CONFIG: z.literal("true"),
          KMS_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
          KMS_KEYID: z.string(),
          KMS_ENDPOINT: z.string()
        }),
        z.object({
          KMS_LOCAL_CONFIG: z.literal("false"),
          KMS_MAX_ACQUISITION_TIMEOUT_SECONDS: z.coerce.number(),
          KMS_KEYID: z.string(),
          KMS_ENDPOINT: z.undefined()
        }),
      ])
 
    .transform((c) => ({
      maxAcquisitionTimeoutSeconds: c.KMS_MAX_ACQUISITION_TIMEOUT_SECONDS,
      kmsKeyId: c.KMS_KEYID,
      kmsEndpoint: c.KMS_ENDPOINT,
      localConfig: c.KMS_LOCAL_CONFIG
    }))
);

    
export type SignerConfig = z.infer<typeof SignerConfig>;

export const signerConfig: () => SignerConfig = () =>
  SignerConfig.parse(process.env);