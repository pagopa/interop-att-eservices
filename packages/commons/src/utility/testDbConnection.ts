import { sql } from "drizzle-orm";
import { logger } from "../logging/index.js";
import { client } from "../db/postgres/client.js";
import { customSchema } from "../db/schema/schema.js";

export const testDbConnection = async (): Promise<boolean> => {
  try {
    const result = await client.execute(
      sql`SELECT schema_name FROM information_schema.schemata WHERE schema_name = ${customSchema.schemaName}`
    );

    if (result.rowCount === 0) {
      throw new Error(`Schema "${customSchema.schemaName}" not found`);
    }

    return true;
  } catch (error) {
    logger.error(`Errore nella connessione al database: ${error}`);
    throw error;
  }
};
