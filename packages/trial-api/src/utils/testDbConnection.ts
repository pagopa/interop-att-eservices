import { db } from "../db/client.js"; // adjust to your actual drizzle instance path
import { logger } from "pdnd-common";
import { sql } from "drizzle-orm";

export const testDbConnection = async (): Promise<boolean> => {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    logger.error(`Errore nella connessione al database: ${error}`);
    throw error;
  }
};
