import { pgSchema } from "drizzle-orm/pg-core";
import { DatabaseConfig } from "../../config/databaseConfig.js";

const parsed = DatabaseConfig.safeParse(process.env);

if (!parsed.success) {
  throw Error(parsed.error.message);
}

const dbSchema = parsed.data.dbSchema;

export const customSchema = pgSchema(dbSchema);
