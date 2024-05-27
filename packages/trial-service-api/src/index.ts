import { logger } from "pdnd-common";
import { sequelize, executeDatabaseMigrations } from "trial";
import app from "./app.js";

const port = process.env.PORT || 3004;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await executeDatabaseMigrations();
    logger.info("Connection to Database has been established.");

    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("SERVER NOT STARTED: ", error);
  }
};

await startServer();
