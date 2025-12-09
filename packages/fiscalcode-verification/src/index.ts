import fs from "fs";
import https from "https";
import {
  initContext,
  initDB,
  initLogger,
  logger,
  testDbConnection,
} from "pdnd-common";
import app from "./app.js";
import { fiscalcodeVerificationConfig } from "./config/config.js";

const port = fiscalcodeVerificationConfig.httpPort;
const portHttps = Number(port) + 443;

const startServer = async (): Promise<void> => {
  try {
    initContext(fiscalcodeVerificationConfig);
    initLogger(fiscalcodeVerificationConfig, "fiscalcode-verification");
    initDB(fiscalcodeVerificationConfig);
    await testDbConnection();

    logger.info("Connection to Database has been established.");

    if (
      fiscalcodeVerificationConfig.httpsKeyPath &&
      fiscalcodeVerificationConfig.httpsCertPath
    ) {
      const privateKey = fs.readFileSync(
        fiscalcodeVerificationConfig.httpsKeyPath,
        "utf8"
      );
      const certificate = fs.readFileSync(
        fiscalcodeVerificationConfig.httpsCertPath,
        "utf8"
      );
      const credentials = { key: privateKey, cert: certificate };

      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(portHttps, () => {
        logger.info(`Server running on https://localhost:${portHttps}`);
      });
    }
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("SERVER NOT STARTED: ", error);
  }
};

await startServer();
