import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { trialServiceConfig } from "./config/config.js";

const startServer = async (): Promise<void> => {
  const port = trialServiceConfig.httpPort;
  try {
    initContext(trialServiceConfig);
    initLogger(trialServiceConfig, "trial-service-api");
    await initDB(trialServiceConfig);
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
