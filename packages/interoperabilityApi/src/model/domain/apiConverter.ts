import {
  JWTModel
} from "pdnd-model";

import {
  JWK
} from "./models.js";

export const apiJwtToTwtModel = (
  jwt: JWK | undefined
): JWTModel => ({
  n: jwt?.n || "",
  e: jwt?.e || "",
  alg: jwt?.alg || "",
  kty: jwt?.kty || "",
  kid: jwt?.kty || "",
  use: jwt?.use || "",
});


/*
 " ": "RS256",
    " ": "AQAB",
    " ": "tZ-CGslofvBXFls1m_UfnxRzjlGoI7QEetouce95VwQ",
    " ": "RSA",
    "n": "u-YZp1z6U1lWPfM5X4Klug792KdiuoVQ-Yccr3mMtyJvLksvVM53TB6lVw40VlME5DYA42ltTf2DEmI2Bni23EWVw-xoc0z9YtLbN4VMH-XNiUFzdanCbB9MIL9-9v8rBWBMEq5cqD_QXJ6cRCdX4DZw-LfvSXbDmW4w8YebrvBO0urfGkKI5dMvMtsf-mY33cRv3ng8hnndT1wfdsqLrTQZwILv--BBuBnxo0-3rzB_WQgXA-TIjWY2fEHI5eq9RvCIEVJbgB0ypD0PjTzqE2RTywJ0_qmGEnTxxECpaOislWZNeOAzJLjLK3SECEm6NBwBMcB1L3oXu7Pw9Ur9RQ",
    "use": "sig"
/*
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
  oth: z.array(OtherPrimeInfoModel).min(1).optional(),*/

