import { initContext, initDB, initLogger, logger } from "pdnd-common";
import { testDbConnection } from "pdnd-common";
import app from "./app.js";
import { digitalAddressVerificationConfig } from "./config/config.js";

const startServer = async (): Promise<void> => {
  const port = digitalAddressVerificationConfig.httpPort;
  try {
    initContext(digitalAddressVerificationConfig);
    initLogger(
      digitalAddressVerificationConfig,
      "digital-address-verification"
    );
    await initDB(digitalAddressVerificationConfig);
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
