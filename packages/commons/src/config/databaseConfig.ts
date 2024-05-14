import { z } from "zod";

export const DatabaseConfig = z
  .object({
    DATABASE_URL: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_SCHEMA: z.string(),
  })
  .transform((c) => ({
    databaseUrl: `postgres://${c.DATABASE_USERNAME}:${c.DATABASE_PASSWORD}@${c.DATABASE_URL}/${c.DATABASE_NAME}?currentSchema=${c.DATABASE_SCHEMA}`,
  }));

export type DatabaseConfig = z.infer<typeof DatabaseConfig>;

export const databaseConfig: () => DatabaseConfig | null = () => {
  const envVars: Record<string, string | undefined> = process.env;
  const requiredEnvVars = [
    "DATABASE_URL",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "DATABASE_SCHEMA",
  ];

  // Verifica se tutte le variabili di ambiente richieste sono definite
  const allVariablesDefined = requiredEnvVars.every(
    (varName) => envVars[varName] !== undefined
  );

  if (!allVariablesDefined) {
    console.error("Non tutte le variabili di ambiente sono definite.");
    return null;
  }

  return DatabaseConfig.parse(envVars);
};
