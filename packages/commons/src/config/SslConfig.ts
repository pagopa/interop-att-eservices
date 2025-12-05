import { z } from "zod";

export const SslConfig = z
  .object({
    HTTPS_KEY_PATH: z.string(),
    HTTPS_CERT_PATH: z.string(),
  })
  .transform((c) => ({
    httpsKeyPath: c.HTTPS_KEY_PATH,
    httpsCertPath: c.HTTPS_CERT_PATH,
  }));
export type SslConfig = z.infer<typeof SslConfig>;

export const sslConfig = (): SslConfig => SslConfig.parse(process.env);
