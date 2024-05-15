import { Umzug, SequelizeStorage } from 'umzug';
import  { sequelize }from '../client.js';
import { Resolver } from 'umzug';
import { readFileSync } from 'fs';

interface MigrationContext {
  queryInterface: any; // Sostituire 'any' con il tipo corretto del contesto di migrazione
}

// Custom resolver for Umzug to handle SQL files
const customResolver: Resolver<MigrationContext> = ({ path }) => {
  if (!path) {
    throw new Error('Path is required');
  }
  const fileName = path.split(/[\/\\]/).pop();
   if (!fileName) throw new Error('Invalid migration file path');
  const split = fileName.split('.');
  const migrationName = `${split[0]}.${split[1]}`;
  const direction = `${split[1]}.${split[2]}`;

  console.log("Migration name: " + migrationName);
  console.log("Direction: " + direction);

  return {
    name: migrationName,
    up: async ({ context }) => {
      console.log("in up  with file", migrationName);
      if (direction === 'up.sql') {
        console.log(" up uguali" + migrationName);
        const sql = readSQLFile(path);
        await context.queryInterface.sequelize.query(sql);
      }
    },
    /*down: async ({ context }) => {
      console.log("in down with file ", migrationName);
      if (direction === 'down.sql') {
        console.log("down uguali "+ migrationName);
        const sql = readSQLFile(path);
        await context.queryInterface.sequelize.query(sql);
      }
    }*/
  };
};

const queryInterface = sequelize.getQueryInterface(); // Otteniamo l'interfaccia di query di Sequelize
const umzug = new Umzug({
  migrations: {
    glob: '../trial-api/migrations/*.{up,down}.sql',
    resolve: customResolver,
  },
  context: { queryInterface }, // Passiamo l'interfaccia di query come parte del contesto
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export const runMigrations = async () => {
  console.log("up");
  await umzug.up();
};

export const rollbackMigrations = async () => {
  await umzug.down();
};

function readSQLFile(fileName: string): string {
  console.log("readSQLFile: " + fileName);

  try {
    // Leggi il contenuto del file sincronamente
    const content = readFileSync(fileName, 'utf-8');
    return content;
  } catch (error) {
    // Gestisci eventuali errori durante la lettura del file
    console.error('Error reading SQL file:', error);
    throw error;
  }
}