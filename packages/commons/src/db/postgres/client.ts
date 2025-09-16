import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { DatabaseConfig } from "../../config/databaseConfig.js";
import { InteroperabilityConfig } from "../../config/commonConfig.js";

const { Pool } = pkg;

const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const client = drizzle({ client: pool });
