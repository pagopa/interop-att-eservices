import { z } from "zod";

export const HandShakesConfig = z
  .object({
    HTTPS_KEY_PATH: z.string(),
    HTTPS_CERT_PATH: z.string(),
  })
  .transform((c) => ({
    httpsKeyPath: c.HTTPS_KEY_PATH,
    httpsCertPath: c.HTTPS_CERT_PATH,
  }));
export type HandShakesConfig = z.infer<typeof HandShakesConfig>;

export const handShakesConfig = (): HandShakesConfig =>
  HandShakesConfig.parse(process.env);
