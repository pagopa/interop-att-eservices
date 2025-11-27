import "dotenv/config";
import { logger } from "pdnd-common";
import { runSeedRotationJob } from "./jobs/SeedRotationJob.js";

logger.info("[App] Starting Seed Rotation Service...");
try {
  await runSeedRotationJob();
} catch (error) {
  logger.error(
    "[SeedRotationJob] Fatal error during seed rotation job:",
    error
  );
}
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", () => void 0);
process.on("SIGINT", () => {
  logger.info("[App] Shutting down gracefully...");
  process.exit(0);
});
