import { z } from "zod";

export const ShClientConfig = z.preprocess(
  (c) => {
    const config = c as Record<string, unknown>;

    return {
      signalHubHost: config.SIGNAL_HUB_HOST ?? "",
      signalHubApiVersion: config.SIGNAL_HUB_API_VERSION ?? "",
    };
  },

  z.object({
    signalHubHost: z.string().url(),
    signalHubApiToken: z.string().min(1),
    signalHubApiVersion: z.string().min(1),
  })
);

export type ShClientConfig = z.infer<typeof ShClientConfig>;

export const shClientConfig: () => ShClientConfig = () =>
  ShClientConfig.parse(process.env);
