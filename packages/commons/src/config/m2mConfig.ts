import { z } from "zod";

export const M2mConfig = z
  .object({
    ALG: z.string().min(1).default("RS256"),
    TYP: z.string().min(1).default("JWT"),
    M2M_TOKEN_ENDPOINT: z.string().url(),
    M2M_PRIVATE_KEY_PATH: z.string().min(1),
    M2M_CLIENT_ID: z.string().uuid(),
    M2M_AUTH_AUDIENCE: z.string().min(1),
    M2M_KID: z.string().min(1),
  })
  .transform((c) => ({
    alg: c.ALG,
    typ: c.TYP,
    tokenEndpoint: c.M2M_TOKEN_ENDPOINT,
    privateKeyPath: c.M2M_PRIVATE_KEY_PATH,
    clientId: c.M2M_CLIENT_ID,
    authAudience: c.M2M_AUTH_AUDIENCE,
    kid: c.M2M_KID,
  }));

export type M2mConfig = z.infer<typeof M2mConfig>;

export const m2mConfig: () => M2mConfig = () => M2mConfig.parse(process.env);
