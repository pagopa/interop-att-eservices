import { z } from "zod";

export const ShConfig = z.preprocess(
  (c) => {
    const config = c as Record<string, unknown>;
    return {
      seedExpireDays: config.seedExpireDays ?? "",
      masterSaltKey: config.masterSaltKey ?? "",
      saltLength: config.saltLength ?? "",
      algorithm: config.algorithm ?? "",
    };
  },
  z.object({
    seedExpireDays: z.string(),
    masterSaltKey: z.string(),
    saltLength: z.string(),
    algorithm: z.string(),
  })
);

export type ShConfig = z.infer<typeof ShConfig>;

export const shConfig: () => ShConfig = () => ShConfig.parse(process.env);
