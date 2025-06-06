import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { DatabaseConfig, InteroperabilityConfig, logger } from "../../index.js";

const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
});

pool
  .connect()
  .then(() => {
    logger.info("Connessione al database effettuata con successo");
  })
  .catch((error) => {
    logger.error("Errore di connessione al database:", error);
  });

export const client = drizzle({ client: pool });
