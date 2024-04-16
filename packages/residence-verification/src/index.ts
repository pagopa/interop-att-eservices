import { logger } from "pdnd-common";
import app from "./app.js";

const port = process.env.PORT || 3001;

const startServer = (): void => {
  app.listen(port, () => {
    // console.log(`Server is running on http://localhost: ` + port);
    logger.info(`Server is running on http://localhost:${port}`);
  });
};

startServer();
/* import { logger } from "pagopa-interop-commons";
import { config } from "./utilities/config.js";
import app from "./app.js";

app.listen(config.port, config.host, () => {
  logger.info(`listening on ${config.host}:${config.port}`);
});
 */
