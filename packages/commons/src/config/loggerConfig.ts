import { z } from "zod";
const EnvBoolean = z.enum(["true", "false"]).transform((v) => v === "true");
export const LoggerConfig = z
  .object({
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    NODE_ENV: z.string().optional().default("test"),
    LOGGER_SILENT: EnvBoolean.default("false"),
  })
  .transform((c) => ({
    logLevel: c.LOG_LEVEL,
    loggerSilent: c.LOGGER_SILENT,
    nodeEnv: c.NODE_ENV,
  }));

export type LoggerConfig = z.infer<typeof LoggerConfig>;
