import { logger } from "pdnd-common";
import app from "./app.js";
import { sequelize } from "trial";

const port = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Connection to Database has been established.');
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('SERVER NOT STARTED: ', error);
  }
};

startServer();
/* import { logger } from "pagopa-interop-commons";
import { config } from "./utilities/config.js";
import app from "./app.js";

app.listen(config.port, config.host, () => {
  logger.info(`listening on ${config.host}:${config.port}`);
});
 */
