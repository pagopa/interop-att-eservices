import { logger } from "pdnd-common";
import { runMigrations } from "./config/umzug.js";

// Funzione per eseguire le migrazioni del database
export async function executeDatabaseMigrations(): Promise<void> {
  try {
    logger.info("executeDatabaseMigrations - Starting migrations...");
    await runMigrations();
    logger.info(
      "executeDatabaseMigrations - Migrations completed successfully."
    );
    // process.exit(0);
  } catch (error) {
    logger.info("executeDatabaseMigrations - Migration failed:", error);
    // process.exit(1);
  }
}
