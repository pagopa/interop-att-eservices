import { z } from "zod";

export const M2mConfig = z
  .object({
    ALG: z.string().min(1).default("RS256"),
    TYP: z.string().min(1).default("JWT"),
    M2M_TOKEN_ENDPOINT: z.string().url(),
    M2M_PRIVATE_KEY_PATH: z.string().min(1),
    M2M_CLIENT_ID: z.string().uuid(),
    M2M_AUTH_AUDIENCE: z.string().min(1),
    M2M_ROLE: z.string().min(1),
    M2M_KMS_KID: z.string().min(1),
    M2M_ORG_ID: z.string().uuid(),
  })
  .transform((c) => ({
    m2mAlg: c.ALG,
    m2mtTyp: c.TYP,
    m2mTokenEndpoint: c.M2M_TOKEN_ENDPOINT,
    m2mPrivateKeyPath: c.M2M_PRIVATE_KEY_PATH,
    m2mClientId: c.M2M_CLIENT_ID,
    m2mAuthAudience: c.M2M_AUTH_AUDIENCE,
    m2mRole: c.M2M_ROLE,
    m2mKmsKid: c.M2M_KMS_KID,
    m2mOrgId: c.M2M_ORG_ID,
  }));

export type M2mConfig = z.infer<typeof M2mConfig>;
