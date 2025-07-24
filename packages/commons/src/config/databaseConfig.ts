import { z } from "zod";
import { logger } from "../index.js";

export const DatabaseConfig = z
  .object({
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_SCHEMA: z.string(),
  })
  .transform((c) => ({
    databaseUrl: `postgres://${c.DATABASE_USERNAME}:${c.DATABASE_PASSWORD}@${c.DATABASE_HOST}:${c.DATABASE_PORT}/${c.DATABASE_NAME}?currentSchema=${c.DATABASE_SCHEMA}`,
  }));

export type DatabaseConfig = z.infer<typeof DatabaseConfig>;

export const databaseConfig: () => DatabaseConfig | null = () => {
  const envVars: Record<string, string | undefined> = process.env;

  const requiredEnvVars = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "DATABASE_SCHEMA",
  ];

  const allVariablesDefined = requiredEnvVars.every(
    (varName) => envVars[varName] !== undefined
  );

  if (!allVariablesDefined) {
    logger.error(
      "Non tutte le variabili d'ambiente necessarie per il database sono definite."
    );
    return null;
  }

  try {
    return DatabaseConfig.parse(envVars);
  } catch (error) {
    logger.error(
      "Errore nel parsing della configurazione del database:",
      error
    );
    return null;
  }
};
