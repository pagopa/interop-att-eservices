import { runMigrations } from './config/umzug.js';

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Funzione per eseguire le migrazioni del database
export async function executeDatabaseMigrations(): Promise<void> {
    register('ts-node/esm', pathToFileURL('./'));

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
