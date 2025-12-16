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
import { keychainSignerConfig } from "./config/keychainSignerConfig.js";

const port = keychainSignerConfig.httpPort;
const portHttps = Number(port) + 443;

const startServer = async (): Promise<void> => {
  try {
    initContext(keychainSignerConfig);
    initLogger(keychainSignerConfig, "keychain-mock");
    initDB(keychainSignerConfig);
    await testDbConnection();

    logger.info("Connection to Database has been established.");

    if (process.env.HTTPS_KEY_PATH && process.env.HTTPS_CERT_PATH) {
      const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH, "utf8");
      const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH, "utf8");
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
