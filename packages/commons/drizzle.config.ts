import { Config, defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string().min(1, "DATABASE_USERNAME is required"),
  DATABASE_PASSWORD: z.string().optional().default(""),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),
  DATABASE_SSL: z.string().optional().default("false"),
});

const env = envSchema.parse(process.env);

export default defineConfig({
  schema: "./dist/db/schema/*.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    ssl: env.DATABASE_SSL.toLowerCase() === "true",
  },
}) satisfies Config;
