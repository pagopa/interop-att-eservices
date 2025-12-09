import { z } from "zod";

export const ShClientConfig = z
  .object({
    SIGNAL_HUB_HOST: z.string().url(),
    SIGNAL_HUB_API_VERSION: z.string().min(1),
  })
  .transform((c) => ({
    signalHubHost: c.SIGNAL_HUB_HOST,
    signalHubApiVersion: c.SIGNAL_HUB_API_VERSION,
  }));

export type ShClientConfig = z.infer<typeof ShClientConfig>;
