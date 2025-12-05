import fs from "fs";
import https from "https";
import { logger, testDbConnection } from "pdnd-common";
import app from "./app.js";
import { fiscalcodeVerificationConfig } from "./config/config.js";

const config = fiscalcodeVerificationConfig;
const port = config.port;
const portHttps = Number(port) + 443;

const startServer = async (): Promise<void> => {
  try {
    logger.info(`Piva verficiation`);
    await testDbConnection();

    logger.info("Connection to Database has been established.");

    if (config.httpsKeyPath && config.httpsCertPath) {
      const privateKey = fs.readFileSync(config.httpsKeyPath, "utf8");
      const certificate = fs.readFileSync(config.httpsCertPath, "utf8");
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
