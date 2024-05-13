import { Liquibase, LiquibaseConfig } from "liquibase";
import { logger } from "pdnd-common";
import dotenv from "dotenv";

// Carica le variabili di ambiente da .env
dotenv.config();

// Verifica se le variabili d'ambiente necessarie sono definite
if (!process.env.LIQUIBASE_DATABASE_URL || !process.env.LIQUIBASE_DATABASE_USERNAME || !process.env.LIQUIBASE_DATABASE_PASSWORD || !process.env.LIQUIBASE_CHANGELOG_FILE) {
  throw new Error("Una o più variabili d'ambiente necessarie non sono definite.");
}
// Crea un oggetto di configurazione Liquibase
const liquibaseConfig: LiquibaseConfig = {
  url: process.env.LIQUIBASE_DATABASE_URL, 
  username: process.env.LIQUIBASE_DATABASE_USERNAME, 
  password: process.env.LIQUIBASE_DATABASE_PASSWORD, 
  changeLogFile: process.env.LIQUIBASE_CHANGELOG_FILE, 
};

// Crea un'istanza di Liquibase con l'oggetto di configurazione
const liquibase = new Liquibase(liquibaseConfig);

export async function runLiquibase(): Promise<void> {

  try {
    await liquibase.update({}); // Passa un oggetto di configurazione vuoto
    logger.info("Modifiche al database applicate con successo.");
  } catch (error) {
    logger.error("Errore nell'applicare le modifiche al database:", error);
  }
}
