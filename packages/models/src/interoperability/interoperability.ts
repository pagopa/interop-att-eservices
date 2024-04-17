import { z } from "zod";

export const OtherPrimeInfoModel = z.object({
  r: z.string(),
  d: z.string(),
  t: z.string(),
});
export type OtherPrimeInfoModel = z.infer<typeof OtherPrimeInfoModel>;

export const JWTModel = z.object({
  kty: z.string(),
  key_ops: z.array(z.string()).optional(),
  use: z.string().optional(),
  alg: z.string().optional(),
  kid: z.string(),
  x5u: z.string().min(1).optional(),
  x5t: z.string().optional(),
  "x5t#S256": z.string().optional(),
  x5c: z.array(z.string()).optional(),
  crv: z.string().optional(),
  x: z.string().optional(),
  y: z.string().optional(),
  d: z.string().optional(),
  k: z.string().optional(),
  n: z.string().optional(),
  e: z.string().optional(),
  p: z.string().optional(),
  q: z.string().optional(),
  dp: z.string().optional(),
  dq: z.string().optional(),
  qi: z.string().optional(),
  oth: z.array(OtherPrimeInfoModel).min(1).optional(),
});
export type JWTModel = z.infer<typeof JWTModel>;
