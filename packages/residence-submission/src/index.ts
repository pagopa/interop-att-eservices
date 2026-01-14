/* eslint-disable no-console */
import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { residenceSubmissionConfig } from "./config/config.js";

const port = residenceSubmissionConfig.httpPort;

const startServer = async (): Promise<void> => {
  try {
    initContext({
      purposeId: "",
      clientId: "",
      correlationId: "",
    });
    initLogger(residenceSubmissionConfig, "residence-submission");
    logger.warn("DEFAULT_PURPOSE_ID");
    logger.warn("DEFAULT_CLIENT_ID");
    logger.warn("DEFAULT_CORRELATION_ID");
    await initDB(residenceSubmissionConfig);
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
