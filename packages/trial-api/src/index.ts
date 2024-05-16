export * from "./client.js";
export * from "./model/trial.js";
export * from "./model/category.js";
export * from "./repository/trialRepository.js";
export * from "./migrate.js"
import { logger } from "pdnd-common";
import { eventManager } from "pdnd-common";
import { TrialRepository } from "./index.js";

const startlistner = async (): Promise<void> => {
  try {
    eventManager.on("trialEvent", async (data) => {
      logger.info(`[START] trialEvent`);
      if (!data.checkName) {
        logger.error("trialEvent - data.checkName cannot be null");
        return;
      }
      await TrialRepository.insert(data.operationPath, data.checkName);
      logger.info(`[END] trialEvent`);
    });
  } catch (error) {
    logger.error("trialEvent - Generic error during trial event: ", error);
  }
};

await startlistner();
