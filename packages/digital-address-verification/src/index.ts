import { logger } from "pdnd-common";
import { testDbConnection } from "pdnd-common";
import app from "./app.js";

const port = process.env.PORT || 3007;

const startServer = async (): Promise<void> => {
  try {
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
