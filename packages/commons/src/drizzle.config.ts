import { defineConfig } from "drizzle-kit";
const getEnv = (key: string, defaultValue: string): string =>
  process.env[key] ?? defaultValue;

export default defineConfig({
  schema: "./src/schema/*",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    host: getEnv("DATABASE_HOST", "localhost"),
    port: Number(getEnv("DATABASE_PORT", "5432")),
    user: getEnv("DATABASE_USERNAME", "postgres"),
    password: getEnv("DATABASE_PASSWORD", "admin"),
    database: getEnv("DATABASE_NAME", "postgres"),
    ssl: process.env.DATABASE_SSL === "true",
  },

  verbose: true,
  strict: true,
});
