import { sql } from "drizzle-orm";
import { logger } from "pdnd-common";
import { db } from "../model/db/index.js";

class HealthRepository {
  public async checkConnection(): Promise<boolean> {
    try {
      await db.execute(sql`SELECT 1`);
      logger.info("Verifica connessione al database riuscita.");
      return true;
    } catch (error) {
      logger.error(
        `Errore durante la verifica della connessione al database: ${error}`
      );
      return false;
    }
  }
}

export default new HealthRepository();
