import fs from "fs";
import https from "https";
import { logger } from "pdnd-common";
import { sequelize } from "trial";
import app from "./app.js";

const port = process.env.PORT || 3002;
const portHttps = Number(port) + 443;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
 
    logger.info("Connection to Database has been established.");

    if (process.env.HTTPS_KEY_PATH && process.env.HTTPS_CERT_PATH) {
      // Leggi i certificati SSL dai file montati
      const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH, "utf8");
      const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH, "utf8");
      const credentials = { key: privateKey, cert: certificate };
      // Crea il server HTTPS
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
/* import { logger } from "pagopa-interop-commons";
import { config } from "./utilities/config.js";
import app from "./app.js";

app.listen(config.port, config.host, () => {
  logger.info(`listening on ${config.host}:${config.port}`);
});
 */
