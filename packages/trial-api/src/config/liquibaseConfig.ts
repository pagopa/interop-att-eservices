import * as fs from "fs";
import { Liquibase, LiquibaseConfig } from "liquibase";
import { logger } from "pdnd-common";

const configPath = "../../packages/trial-api/liquibase.json"; // Percorso del file di configurazione Liquibase

// Leggi il file di configurazione come stringa
const configString = fs.readFileSync(configPath, "utf-8");

// Converti la stringa JSON in un oggetto JavaScript
const configData = JSON.parse(configString);

// Crea un oggetto di configurazione Liquibase
const liquibaseConfig: LiquibaseConfig = {
  ...configData, // Assicurati che il formato di liquibase.json sia corretto
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
