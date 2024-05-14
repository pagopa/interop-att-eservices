import { Liquibase, LiquibaseConfig } from "liquibase";
import { logger } from "pdnd-common";
import dotenv from "dotenv";
import  {liquibaseConfigEnv } from "pdnd-common"
// Carica le variabili di ambiente da .env
dotenv.config();
const config = liquibaseConfigEnv();

// Verifica se le variabili d'ambiente necessarie sono definite
if (!config) {
  throw new Error("Una o più variabili d'ambiente necessarie non sono definite.");

}
// Crea un oggetto di configurazione Liquibase
const liquibaseConfig: LiquibaseConfig = {
  url: config.databaseUrl,
  username: config.username, 
  password: config.password,
  changeLogFile: "../trial-api/migrations/changelog.xml", 
};

// Crea un'istanza di Liquibase con l'oggetto di configurazione
const liquibase = new Liquibase(liquibaseConfig);

export async function runLiquibase(): Promise<void> {

  try {
    await liquibase.update({}); // Passa un oggetto di configurazione vuoto
    logger.info("Modifiche al database applicate con successo.");
  } catch (error) {
    logger.error("Errore nell'applicare le modifiche al database:", error);
    throw new Error("Errore nell'applicare le modifiche al database");
  }
}
