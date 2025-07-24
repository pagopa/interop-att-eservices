import { z } from "zod";

export const HandshakeModel = z.object({
  apikey: z.string(),
  cert: z.string(),
});
export type HandshakeModel = z.infer<typeof HandshakeModel>;
