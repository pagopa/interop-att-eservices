import { z } from "zod";

export const ContextConfig = z
  .object({
    PURPOSE_ID: z.string(),
    CLIENT_ID: z.string(),
    CORRELATION_ID: z.string(),
  })
  .transform((c) => ({
    purposeId: c.PURPOSE_ID,
    clientId: c.CLIENT_ID,
    correlationId: c.CORRELATION_ID,
  }));

export type ContextConfig = z.infer<typeof ContextConfig>;

export const contextConfig = (): ContextConfig =>
  ContextConfig.parse(process.env);
