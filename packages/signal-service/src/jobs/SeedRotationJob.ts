import { logger } from "pdnd-common";
import { SeedRotationController } from "../controllers/signalServiceController.js";

export async function runSeedRotationJob(): Promise<void> {
  logger.info("[SeedRotationJob] Starting seed rotation job...");
  try {
    await SeedRotationController.executeSeedRotation();
    logger.info("[SeedRotationJob] Seed rotation job finished.");
  } catch (error) {
    logger.error(
      "[SeedRotationJob] Fatal error during seed rotation job:",
      error
    );
    throw error;
  }
}
