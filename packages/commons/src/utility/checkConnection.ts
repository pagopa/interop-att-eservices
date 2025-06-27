import { sql } from "drizzle-orm";
import { client } from "../db/postgres/client.js";
import { logger } from "../logging/index.js";

export const checkConnection = async (): Promise<boolean> => {
  try {
    await client.execute(sql`SELECT 1`);
    logger.info("Database connection check successful.");
    return true;
  } catch (error) {
    logger.error(`Error during database connection check: ${error}`);
    throw error;
  }
};
