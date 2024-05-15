import { runMigrations } from './config/umzug.js';

// Funzione per eseguire le migrazioni del database
export async function executeDatabaseMigrations(): Promise<void> {

    try {
        console.log('Starting migrations...');
        await runMigrations();
        console.log('Migrations completed successfully.');
        //process.exit(0);
      } catch (error) {
        console.error('Migration failed:', error);
        //process.exit(1);
      }
}
