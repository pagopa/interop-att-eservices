export * from "./client.js";
export * from "./model/trial.js";
export * from "./model/category.js";
export * from "./repository/trialRepository.js";
export * from "./migrate.js"
import { logger } from "pdnd-common";
import { eventManager, syncEventEmitter } from "pdnd-common";
import { TrialRepository } from "./index.js";
import { existCorrelationId } from "./services/trialService.js";

const startlistner = async (): Promise<void> => {
  try {
    eventManager.on("trialEvent", async (data) => {
      logger.info(`[START] trialEvent`);
      if (!data.checkName) {
        logger.error("trialEvent - data.checkName cannot be null");
        return;
      }
      await TrialRepository.insert(data.operationPath, data.operationMethod, data.checkName, data.response);
      logger.info(`[END] trialEvent`);
    });
  } catch (error) {
    logger.error("trialEvent - Generic error during trial event: ", error);
  }

  syncEventEmitter.on('checkCorrelationId', async ({ resolve, reject, args }: any) => {
    try {
      const result = await existCorrelationId(args[0]);
      logger.info(`[result] result` + result);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};


await startlistner();
