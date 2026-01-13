import "dotenv/config";
import { initContext, initLogger, logger } from "pdnd-common";
import { runSeedRotationJob } from "./jobs/SeedRotationJob.js";
import { shConfig } from "./config/config.js";

try {
  initContext(shConfig);
  initLogger(shConfig, "signal-job");

  logger.info("[SeedRotationJob] Starting Seed Rotation Service...");
  await runSeedRotationJob();

  logger.info(
    "[SeedRotationJob] Seed Rotation Service completed successfully."
  );
} catch (error) {
  logger.error(
    "[SeedRotationJob] Fatal error during seed rotation job:",
    error
  );
  process.exit(1);
}
