import { logger } from "pdnd-common";
import { CronJob } from "cron";
import { SeedRotationController } from "../controllers/signalServiceController.js";
import { shConfig } from "../config/config.js";
export async function runSeedRotationJob(): Promise<void> {
  logger.info("[SeedRotationJob] Starting seed rotation job...");
  try {
    CronJob.from({
      cronTime: shConfig.cronTime,
      onTick: async () => {
        await SeedRotationController.executeSeedRotation();
        logger.info("[SeedRotationJob] Seed rotation job finished.");
      },
      start: true,
      timeZone: "Europe/Rome",
    });
  } catch (error) {
    logger.error(
      "[SeedRotationJob] Fatal error during seed rotation job:",
      error
    );
    throw error;
  }
}
