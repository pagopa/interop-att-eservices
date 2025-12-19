import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { residenceVerificationConfig } from "./config/config.js";

const port = residenceVerificationConfig.httpPort;

const startServer = async (): Promise<void> => {
  try {
    initContext(residenceVerificationConfig);
    initLogger(residenceVerificationConfig, "residence-verification");
    await initDB(residenceVerificationConfig);
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
