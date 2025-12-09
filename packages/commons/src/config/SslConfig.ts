import { z } from "zod";

export const SslConfig = z
  .object({
    HTTPS_KEY_PATH: z.string().optional(),
    HTTPS_CERT_PATH: z.string().optional(),
  })
  .transform((c) => ({
    httpsKeyPath: c.HTTPS_KEY_PATH ?? null,
    httpsCertPath: c.HTTPS_CERT_PATH ?? null,
  }));

export type SslConfig = z.infer<typeof SslConfig>;
