import { readFileSync } from "fs";
import * as path from "path";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import {
  digitalAddressesTable,
  listRequestsTable,
  logger,
  requestSubjectsTable,
  subjectDataResponsesTable,
  verificationLogsTable,
  verificationRequestsTable,
} from "pdnd-common/dist/index.js";
import {
  TEST_POSTGRES_DB_NAME,
  TEST_POSTGRES_DB_PASSWORD,
  TEST_POSTGRES_DB_USER,
  TEST_POSTGRES_SCHEMA,
} from "./config.js";

// L'oggetto drizzleSchema contiene SOLO le tabelle pdnd-common
const drizzleSchema = {
  digitalAddresses: digitalAddressesTable,
  listRequests: listRequestsTable,
  requestSubjects: requestSubjectsTable,
  subjectDataResponses: subjectDataResponsesTable,
  verificationLogs: verificationLogsTable,
  verificationRequests: verificationRequestsTable,
};

type SetupTestDbReturnType = {
  db: NodePgDatabase<typeof drizzleSchema>;
  container: StartedPostgreSqlContainer;
  client: Client;
};

export async function setupTestDb(): Promise<SetupTestDbReturnType> {
  const startedContainer: StartedPostgreSqlContainer =
    await new PostgreSqlContainer("postgres:15")
      .withDatabase(TEST_POSTGRES_DB_NAME)
      .withUsername(TEST_POSTGRES_DB_USER)
      .withPassword(TEST_POSTGRES_DB_PASSWORD)
      .start();

  const host = startedContainer.getHost();
  const port = startedContainer.getPort();

  const client = new Client({
    host,
    port,
    user: startedContainer.getUsername(),
    password: startedContainer.getPassword(),
    database: startedContainer.getDatabase(),
  });

  await client.connect();

  // Use __dirname directly (CommonJS)
  const sqlFilePath = path.join(__dirname, "init-db.sql");

  const sqlScript = readFileSync(sqlFilePath, "utf-8");

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${TEST_POSTGRES_SCHEMA};`);
    await client.query(sqlScript);
  } catch (err) {
    logger.error(`Errrore durante l'esecuzione dello script SQL: ${err}`);
    throw err;
  }

  const db = drizzle(client, { schema: drizzleSchema });

  return {
    db,
    container: startedContainer,
    client,
  };
}

export async function populateBaseTestData(client: Client): Promise<void> {
  try {
    await client.query("BEGIN");

    const listRequestId1 = uuidv4();
    const submittedRequestId1 = uuidv4();
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.list_requests (id, submitted_request_id, status, created_at)
      VALUES ('${listRequestId1}', '${submittedRequestId1}', 'DISPONIBILE', NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    const listRequestId2 = uuidv4();
    const submittedRequestId2 = uuidv4();
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.list_requests (id, submitted_request_id, status, created_at)
      VALUES ('${listRequestId2}', '${submittedRequestId2}', 'PRESA_IN_CARICO', NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    // Dati per subject_data_responses
    // I codici fiscali devono rispettare la regex id_subject_check
    const subjectDataResponseId1 = 1; // BigSerial auto-incrementa, ma utile per FK successive
    const subjectId1 = "RSSMRA80A01H501F";
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.subject_data_responses (id, list_request_id, subject_id, data_from)
      VALUES (${subjectDataResponseId1}, '${listRequestId1}', '${subjectId1}', NOW())
      ON CONFLICT (list_request_id, subject_id) DO NOTHING;
    `);

    const subjectDataResponseId2 = 2;
    const subjectId2 = "BNCLNG80A01H501J";
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.subject_data_responses (id, list_request_id, subject_id, data_from)
      VALUES (${subjectDataResponseId2}, '${listRequestId2}', '${subjectId2}', NOW())
      ON CONFLICT (list_request_id, subject_id) DO NOTHING;
    `);

    // Dati per digital_addresses
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.digital_addresses (subject_data_response_id, address, profession, usage_reason, usage_end_at)
      VALUES
      (${subjectDataResponseId1}, 'mario.rossi@pec.it', NULL, 'CESSAZIONE_UFFICIO', '2025-12-31T23:59:59Z'),
      (${subjectDataResponseId2}, 'luca.bianchi@PEC.IT', 'Architetto', 'CESSAZIONE_VOLONTARIA', '2026-06-30T23:59:59Z')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Dati per request_subjects
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.request_subjects (list_request_id, subject_id)
      VALUES
      ('${listRequestId1}', '${subjectId1}'),
      ('${listRequestId2}', '${subjectId2}')
      ON CONFLICT (list_request_id, subject_id) DO NOTHING;
    `);

    // Dati per verification_requests
    const verificationRequestId1 = uuidv4();
    const verificationRequestId2 = uuidv4();
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.verification_requests (id, count, json_request, created_at, updated_at)
      VALUES
      ('${verificationRequestId1}', 1, '{"request_type": "initial"}', NOW(), NOW()),
      ('${verificationRequestId2}', 2, '{"request_type": "update"}', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    // Dati per verification_logs
    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.verification_logs (result, checked_at)
      VALUES
      (TRUE, NOW()),
      (FALSE, NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
