import { readFileSync } from "fs";
import * as path from "path";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { Subject } from "../src/model/db/subject.model";
import { Address } from "../src/model/db/address.model";
import { Usecase } from "../src/model/db/usecase.model";
import {
  TEST_POSTGRES_DB_NAME,
  TEST_POSTGRES_DB_PASSWORD,
  TEST_POSTGRES_DB_USER,
  TEST_POSTGRES_SCHEMA,
} from "./config";

const drizzleSchema = {
  Subject,
  Address,
  Usecase,
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

  const sqlFilePath = path.join(__dirname, "init-db.sql");
  const sqlScript = readFileSync(sqlFilePath, "utf-8");
  await client.query(sqlScript);

  try {
    await client.query("BEGIN");

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.subjects (uuid, id, subject_id, surname, name, gender, birth_event_date, birth_exceptional_place, birth_municipality_name, birth_municipality_istat_code, birth_municipality_acronym_istat_province, birth_municipality_place_description, birth_place_description, birth_country_description, birth_cod_state, birth_province_county)
      VALUES
      ('fedcba98-7654-3210-fedc-ba9876543210', 'SUB001', 's1', 'Rossi', 'Mario', 'M', '1980-01-01', NULL, 'Roma', '058091', 'RM', 'Municipio I', 'Roma', 'Italia', 'IT', 'Lazio')
      ON CONFLICT (uuid) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.addresses (
        id, 
        address_type, 
        toponym_denomination, 
        civic_number, 
        address_municipality_name, 
        address_municipality_istat_code, 
        address_municipality_acronym_istat_province
      )
      VALUES (
        '12345678-9abc-def0-1234-567890abcdef', 
        'RESIDENZA', 
        'VIA MAGNOLIA',
        '12B',
        'Roma',
        '058091',
        'RM'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.purposes (id)
      VALUES ('abcdef01-2345-6789-abcd-ef0123456789')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.purposes (id)
      VALUES ('00000000-0000-0000-0000-000000000002') 
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.usecases (id, purpose_id, subject_id, address_id)
      VALUES ('f8b2c1d0-e6a7-4493-a9b5-2c07d8e1f35a', 'abcdef01-2345-6789-abcd-ef0123456789', 'fedcba98-7654-3210-fedc-ba9876543210', '12345678-9abc-def0-1234-567890abcdef')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.subjects (uuid, id, subject_id)
      VALUES ('f9e8d7c6-b5a4-3210-fedc-ba9876543210', 'SUB002', 's2')
      ON CONFLICT (uuid) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.addresses (id, address_type) 
      VALUES ('98765432-10fe-dcba-9876-543210fedcba', 'DOMICILIO')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO ${TEST_POSTGRES_SCHEMA}.usecases (id, subject_id, address_id, purpose_id)
      VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'f9e8d7c6-b5a4-3210-fedc-ba9876543210', '98765432-10fe-dcba-9876-543210fedcba', '00000000-0000-0000-0000-000000000002')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }

  const db = drizzle(client, { schema: drizzleSchema });

  return {
    db,
    container: startedContainer,
    client,
  };
}
