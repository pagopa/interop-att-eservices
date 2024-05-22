import { readFileSync } from "fs";
import { Umzug, SequelizeStorage } from "umzug";
import { Resolver } from "umzug";
import { logger } from "pdnd-common";
import { sequelize } from "../client.js";

/* eslint-disable */
interface MigrationContext {
  queryInterface: any;
}
/* eslint-enable */

// Custom resolver for Umzug to handle SQL files
const customResolver: Resolver<MigrationContext> = ({ path }) => {
  if (!path) {
    throw new Error("Path is required");
  }
  /* eslint-disable */
  const fileName = path.split(/[\/\\]/).pop();
  /* eslint-enable */
  if (!fileName) {
    throw new Error("Invalid migration file path");
  }
  const split = fileName.split(".");
  const migrationName = `${split[0]}.${split[1]}`;
  const direction = `${split[1]}.${split[2]}`;

  logger.info("Migration name: " + migrationName);
  logger.info("Direction: " + direction);

  return {
    name: migrationName,
    up: async ({ context }): Promise<void> => {
      logger.info("in up  with file", migrationName);
      if (direction === "up.sql") {
        logger.info(" up uguali" + migrationName);
        const sql = readSQLFile(path);
        await context.queryInterface.sequelize.query(sql);
      }
    },
  };
};

const queryInterface = sequelize.getQueryInterface(); // Otteniamo l'interfaccia di query di Sequelize
const umzug = new Umzug({
  migrations: {
    glob: "../trial-api/migrations/*.{up,down}.sql",
    resolve: customResolver,
  },
  context: { queryInterface }, // Passiamo l'interfaccia di query come parte del contesto
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export const runMigrations = async (): Promise<void> => {
  logger.info("up");
  await umzug.up();
};

export const rollbackMigrations = async (): Promise<void> => {
  await umzug.down();
};

function readSQLFile(fileName: string): string {
  logger.info("readSQLFile: " + fileName);

  try {
    // Leggi il contenuto del file sincronamente
    return readFileSync(fileName, "utf-8");
  } catch (error) {
    // Gestisci eventuali errori durante la lettura del file
    logger.error("Error reading SQL file:", error);
    throw error;
  }
}
