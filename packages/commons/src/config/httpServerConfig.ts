import { z } from "zod";
import { APIEndpoint } from "../model/apiEndpoint.js";

export const HTTPServerConfig = z
  .object({
    HOST: APIEndpoint,
    PORT: z.coerce.number().min(1001),
  })
  .transform((c) => ({
    httpHost: c.HOST,
    httpPort: c.PORT,
  }));

export type HTTPServerConfig = z.infer<typeof HTTPServerConfig>;
