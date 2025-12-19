import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { familyStatusConfiguration } from "./config/config.js";

const port = familyStatusConfiguration.httpPort;

const startServer = async (): Promise<void> => {
  try {
    initContext(familyStatusConfiguration);
    initLogger(familyStatusConfiguration, "family-status");
    await initDB(familyStatusConfiguration);
    await testDbConnection();
    logger.info("Connection to Database has been established.");
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("SERVER NOT STARTED: ", error);
  }
};

await startServer();
