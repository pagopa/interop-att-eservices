import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { InteroperabilityConfig, DatabaseConfig, logger } from "pdnd-common";
const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
});
pool
  .connect()
  .then(() => {
    logger.info("Database connection successful");
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });

const db = drizzle({ client: pool });
export { db };
