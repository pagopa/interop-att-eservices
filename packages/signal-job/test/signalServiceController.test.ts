import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { logger } from "pdnd-common";
import { SeedRotationController } from "../src/controllers/signalServiceController.js";
import { SHRepository } from "../src/repositories/SHRepository.js";
import { SignalHubClient } from "../src/repositories/SignalHubClient.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
  shConfig: vi.fn(() => ({
    signalHubHost: "fake-host.com",
    signalHubApiVersion: "v1",
  })),
  getPDNDTokenM2M: vi.fn(() => Promise.resolve("fake-jwt-token")),
}));

vi.mock("../src/repositories/SHRepository.js", () => ({
  SHRepository: {
    getAllEserviceIds: vi.fn(),
    ensureAndIncrementSignalId: vi.fn(),
  },
}));

vi.mock("../src/repositories/SignalHubClient.js", () => ({
  SignalHubClient: {
    sendSeedUpdateSignal: vi.fn(),
  },
}));

vi.mock("../src/config/config.js", () => ({
  shConfig: {
    startDateMs: new Date("2023-01-01T00:00:00.000Z").getTime(),
    seedExpireDays: 7,
    saltLength: 16,
    algorithm: "sha256",
  },
}));

describe("SeedRotationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should do nothing if it is not the first day of the seed period", async () => {
    vi.setSystemTime(new Date("2023-01-02T10:00:00.000Z"));
    await SeedRotationController.executeSeedRotation();

    expect(logger.info).not.toHaveBeenCalledWith(
      "[SeedRotationController] Proceeding with SEEDUPDATE."
    );
    expect(SHRepository.getAllEserviceIds).not.toHaveBeenCalled();
  });

  it("should execute rotation on the first day of a new period", async () => {
    vi.setSystemTime(new Date("2023-01-08T08:00:00.000Z"));

    const eserviceIds = ["eservice-1", "eservice-2"];
    (SHRepository.getAllEserviceIds as Mock).mockResolvedValue(eserviceIds);
    (SHRepository.ensureAndIncrementSignalId as Mock)
      .mockResolvedValueOnce(123)
      .mockResolvedValueOnce(456);

    await SeedRotationController.executeSeedRotation();

    expect(logger.info).toHaveBeenCalledWith(
      "[SeedRotationController] Proceeding with SEEDUPDATE."
    );
    expect(SHRepository.getAllEserviceIds).toHaveBeenCalledTimes(1);
    expect(SHRepository.ensureAndIncrementSignalId).toHaveBeenCalledWith(
      "eservice-1"
    );
    expect(SignalHubClient.sendSeedUpdateSignal).toHaveBeenCalledWith(
      "eservice-1",
      123
    );
    expect(SHRepository.ensureAndIncrementSignalId).toHaveBeenCalledWith(
      "eservice-2"
    );
    expect(SignalHubClient.sendSeedUpdateSignal).toHaveBeenCalledWith(
      "eservice-2",
      456
    );
  });
});
