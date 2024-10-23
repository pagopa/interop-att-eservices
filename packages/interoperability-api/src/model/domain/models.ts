/* import { z } from "zod";
import * as api from "../generated/api.js";

export type JWK = z.infer<
  typeof api.schemas.JWK
>; */

export interface JWK {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
