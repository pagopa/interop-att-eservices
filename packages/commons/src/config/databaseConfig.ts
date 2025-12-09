import { z } from "zod";

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
    username: c.DATABASE_USERNAME,
    password: c.DATABASE_PASSWORD,
    dbHost: c.DATABASE_HOST,
    dbPort: c.DATABASE_PORT,
    dbName: c.DATABASE_NAME,
    dbSchema: c.DATABASE_SCHEMA,
  }));

export type DatabaseConfig = z.infer<typeof DatabaseConfig>;
