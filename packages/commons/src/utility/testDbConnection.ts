import { sql } from "drizzle-orm";
import { logger } from "../logging/index.js";
import { client } from "../db/postgres/client.js";

export const testDbConnection = async (): Promise<boolean> => {
  try {
    await client.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    logger.error(`Errore nella connessione al database: ${error}`);
    throw error;
  }
};
