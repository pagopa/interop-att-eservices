/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { DatabaseConfig } from "../../config/databaseConfig.js";
import { InteroperabilityConfig } from "../../config/commonConfig.js";

const { Pool } = pkg;

const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);

const pool = new Pool({
  connectionString: config.databaseUrl,
});

// ======================================================================
// ====================== DIAGNOSI FINALE DEFINITIVA ====================
// ======================================================================
async function runDiagnostic(): Promise<void> {
  console.log("\n\n\n--- INIZIO DIAGNOSI FINALE ---");
  const client = await pool.connect();
  console.log("Connessione per la diagnosi stabilita.\n");

  try {
    // TEST 1: Leggiamo da 'list_requests' (dovrebbe funzionare)
    console.log("--> Eseguo TEST 1: SELECT su 'att.list_requests'...");
    const res1 = await client.query(
      "SELECT id FROM att.list_requests LIMIT 1;"
    );
    console.log(
      "    RISULTATO TEST 1: SUCCESSO! Dati trovati:",
      res1.rows,
      "\n"
    );

    // TEST 2: Leggiamo da 'request_subjects' (questo è il test chiave)
    console.log("--> Eseguo TEST 2: SELECT su 'att.request_subjects'...");
    const res2 = await client.query(
      "SELECT list_request_id, subject_id FROM att.request_subjects LIMIT 1;"
    );
    console.log(
      "    RISULTATO TEST 2: SUCCESSO! Dati trovati:",
      res2.rows,
      "\n"
    );

    // TEST 3: Eseguiamo la query con il JOIN (quella che fallisce nell'app)
    console.log("--> Eseguo TEST 3: Query con JOIN...");
    const res3 = await client.query(
      "SELECT s.subject_id FROM att.request_subjects AS s INNER JOIN att.list_requests AS r ON s.list_request_id = r.id LIMIT 1;"
    );
    console.log(
      "    RISULTATO TEST 3: SUCCESSO! Dati trovati:",
      res3.rows,
      "\n"
    );

    console.log(
      "DIAGNOSI COMPLETATA: Tutte le query dirette hanno funzionato. Il problema è estremamente specifico di come Drizzle esegue la query con parametri."
    );
  } catch (err) {
    console.error(
      "\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    console.error(
      "!!!!!!!!!!!!!!   DIAGNOSI FALLITA, ECCO L'ERRORE REALE   !!!!!!!!!!!!!!"
    );
    console.error(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"
    );
    console.error(
      "L'ERRORE È AVVENUTO DURANTE UNO DEI TEST. QUESTA È LA CAUSA DI TUTTO:"
    );
    console.error(err);
    console.error(
      "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n"
    );
  } finally {
    console.log("--- FINE DIAGNOSI ---");
    client.release();
  }
}

runDiagnostic().catch(console.error);
// ======================================================================
// ======================================================================

// Il resto dell'app viene inizializzato normalmente
export const client = drizzle({ client: pool });
