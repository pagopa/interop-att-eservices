import { resolve } from "path";
import { GenericContainer } from "testcontainers";

export const TEST_POSTGRES_DB_PORT = 5432;
export const TEST_POSTGRES_DB_IMAGE = "postgres:14";
export const TEST_POSTGRES_DB_NAME = "testdb";
export const TEST_POSTGRES_DB_USER = "postgres";
export const TEST_POSTGRES_DB_PASSWORD = "postgres";
export const TEST_POSTGRES_SCHEMA = "att";
export const TEST_POSTGRES_URL = "localhost:55000";
export const DATA_BASE_URL = `postgres://${TEST_POSTGRES_DB_USER}:${TEST_POSTGRES_DB_PASSWORD}@${TEST_POSTGRES_URL}/${TEST_POSTGRES_DB_NAME}?schema=${TEST_POSTGRES_SCHEMA}`;

export const postgreSQLContainer = (): GenericContainer =>
  new GenericContainer(TEST_POSTGRES_DB_IMAGE)
    .withEnvironment({
      POSTGRES_USER: TEST_POSTGRES_DB_USER,
      POSTGRES_PASSWORD: TEST_POSTGRES_DB_PASSWORD,
      POSTGRES_DB: TEST_POSTGRES_DB_NAME,
    })
    .withCopyFilesToContainer([
      {
        source: resolve(__dirname, "init-db.sql"),
        target: "/docker-entrypoint-initdb.d/01-init.sql",
      },
    ])
    .withExposedPorts(TEST_POSTGRES_DB_PORT);
