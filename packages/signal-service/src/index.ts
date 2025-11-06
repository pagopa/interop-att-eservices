import { runSeedRotationJob } from "./jobs/SeedRotationJob.js";

runSeedRotationJob()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
