import { databaseConfig, logger } from "pdnd-common";
import { Sequelize } from "sequelize";

const config = databaseConfig();

// Verifica se le variabili d'ambiente necessarie sono definite
if (!config) {
  throw new Error(
    "Una o più variabili d'ambiente necessarie non sono definite."
  );
}

// Log del database URL
logger.info("Database URL:", config.databaseUrl);

const sequelize = new Sequelize(config.databaseUrl ?? "");

export { sequelize };
