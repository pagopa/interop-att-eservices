import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { logger } from "pdnd-common";
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
  SignerConfig: {},
  InteroperabilityConfig: {},
  JWTConfig: {},
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

  it("should execute the seed rotation controller", async () => {
    (SeedRotationController.executeSeedRotation as Mock).mockResolvedValue(
      undefined
    );

    await runSeedRotationJob();

    expect(SeedRotationController.executeSeedRotation).toHaveBeenCalledTimes(1);
  });

  it("should log and throw if execution fails", async () => {
    const executionError = new Error("Execution failed");
    (SeedRotationController.executeSeedRotation as Mock).mockRejectedValue(
      executionError
    );

    await expect(runSeedRotationJob()).rejects.toThrow(executionError);

    expect(logger.error).toHaveBeenCalledWith(
      "[SeedRotationJob] Fatal error during seed rotation job:",
      executionError
    );
  });
});
