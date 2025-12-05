import { z } from "zod";

export const LoggerConfig = z
  .object({
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    NODE_ENV: z.string().optional().default("test"),
  })
  .transform((c) => ({
    logLevel: c.LOG_LEVEL,
    nodeEnv: c.NODE_ENV ?? "test",
  }));
export type LoggerConfig = z.infer<typeof LoggerConfig>;

export const loggerConfig = (): LoggerConfig => LoggerConfig.parse(process.env);
