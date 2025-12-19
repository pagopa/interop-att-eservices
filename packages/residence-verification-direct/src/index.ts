import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { residenceVerificationDirectConfig } from "./config/config.js";

const port = residenceVerificationDirectConfig.httpPort;

const startServer = async (): Promise<void> => {
  try {
    initContext(residenceVerificationDirectConfig);
    initLogger(
      residenceVerificationDirectConfig,
      "residence-verification-direct"
    );
    await initDB(residenceVerificationDirectConfig);
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
