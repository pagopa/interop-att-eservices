import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { logger } from "pdnd-common";
import { CronJob } from "cron";
import { SeedRotationController } from "../src/controllers/signalServiceController.js";
import { runSeedRotationJob } from "../src/jobs/SeedRotationJob.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  shConfig: vi.fn(() => ({
    signalHubHost: "fake-host.com",
    signalHubApiVersion: "v1",
  })),
  getPDNDTokenM2M: vi.fn(() => Promise.resolve("fake-jwt-token")),
}));

vi.mock("cron", () => ({
  CronJob: {
    from: vi.fn(),
  },
}));

vi.mock("../src/controllers/signalServiceController.js", () => ({
  SeedRotationController: {
    executeSeedRotation: vi.fn(),
  },
}));

describe("runSeedRotationJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create the cron job with correct parameters", async () => {
    (SeedRotationController.executeSeedRotation as Mock).mockResolvedValue(
      undefined
    );

    await runSeedRotationJob();

    expect(logger.info).toHaveBeenCalledWith(
      "[SeedRotationJob] Starting seed rotation job..."
    );
    expect(CronJob.from).toHaveBeenCalledWith(
      expect.objectContaining({
        cronTime: "0 5 0 * * *",
        start: true,
        timeZone: "Europe/Rome",
      })
    );
  });

  it("should execute the rotation controller when the tick fires", async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (CronJob.from as Mock).mockImplementation(() => {});
    (SeedRotationController.executeSeedRotation as Mock).mockResolvedValue(
      undefined
    );

    await runSeedRotationJob();

    expect(CronJob.from).toHaveBeenCalledTimes(1);

    const mockCallArgs = (CronJob.from as Mock).mock.calls[0][0];
    const capturedOnTick = mockCallArgs.onTick as () => Promise<void>;

    expect(capturedOnTick).toBeDefined();

    await capturedOnTick();

    expect(SeedRotationController.executeSeedRotation).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      "[SeedRotationJob] Seed rotation job finished."
    );
  });

  it("should log and throw if cron job creation fails", async () => {
    const creationError = new Error("Invalid cron pattern");
    (CronJob.from as Mock).mockImplementation(() => {
      throw creationError;
    });

    await expect(runSeedRotationJob()).rejects.toThrow(creationError);

    expect(logger.error).toHaveBeenCalledWith(
      "[SeedRotationJob] Fatal error during seed rotation job:",
      creationError
    );
  });
});
