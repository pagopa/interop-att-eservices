import { logger, testDbConnection } from "pdnd-common";
import app from "./app.js";

const port = process.env.PORT || 3001;

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
