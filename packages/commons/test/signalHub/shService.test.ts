/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const {
  mockLogger,
  mockFindConfigByEserviceId,
  mockEnsureAndIncrementSignalId,
  mockShClientConfig,
  mockAxiosPost,
  mockIsAxiosError,
  mockConfig,
} = vi.hoisted(() => {
  const mockConfig = {
    signalHubHost: "http://mock-signal-hub.com",
    signalHubApiVersion: "v1",
  };

  return {
    mockLogger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    mockFindConfigByEserviceId: vi.fn(),
    mockEnsureAndIncrementSignalId: vi.fn(),
    mockShClientConfig: vi.fn().mockReturnValue(mockConfig),
    mockAxiosPost: vi.fn(),
    mockIsAxiosError: vi.fn(),
    mockConfig,
  };
});

vi.mock("../../src/index.js", () => ({
  logger: mockLogger,
}));

vi.mock("../../src/repositories/signalHub/index.js", () => ({
  SHRepository: {
    findConfigByEserviceId: mockFindConfigByEserviceId,
    ensureAndIncrementSignalId: mockEnsureAndIncrementSignalId,
  },
}));

vi.mock("../../src/config/shClientConfig.js", () => ({
  shClientConfig: mockShClientConfig,
}));

vi.mock("axios", () => ({
  default: {
    post: mockAxiosPost,
    isAxiosError: mockIsAxiosError,
  },
}));

import {
  SHService,
  SignalPayload,
} from "../../src/services/signalHub/shService.js";

describe("SHService", () => {
  const mockPayload: SignalPayload = {
    signalId: 1,
    objectType: "TEST",
    objectId: "test-obj-123",
    eserviceId: "eservice-abc",
    signalType: "UPDATE",
  };
  const mockToken = "mock-pdnd-token-string";

  beforeEach(() => {
    vi.clearAllMocks();
    mockShClientConfig.mockReturnValue(mockConfig);
    mockIsAxiosError.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("sendSignal", () => {
    it("should handle a successful response", async () => {
      const mockAxiosResponse = {
        status: 200,
        data: { signalid: 1 },
      };
      mockAxiosPost.mockResolvedValue(mockAxiosResponse);

      await SHService.sendSignal(mockPayload, mockToken);

      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SHService] Sending signal (axios) for ${mockPayload.objectId}`
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        `[ANPRService] Signal sent successfully. Status: 200`
      );
      expect(mockAxiosPost).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should log error if pdndToken is not provided", async () => {
      await SHService.sendSignal(mockPayload, "");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "[SHService] M2M_TOKEN was not configured"
      );
      expect(mockAxiosPost).not.toHaveBeenCalled();
    });

    it("should handle Axios errors correctly", async () => {
      const axiosError = {
        response: { status: 404 },
        message: "Not Found",
      };

      mockAxiosPost.mockRejectedValue(axiosError);
      mockIsAxiosError.mockReturnValue(true);

      await expect(
        SHService.sendSignal(mockPayload, mockToken)
      ).rejects.toEqual(axiosError);

      expect(mockLogger.error).toHaveBeenCalledWith(
        `[ANPRService] API Error: 404 - Not Found`
      );
    });

    it("should handle generic errors correctly", async () => {
      const genericError = new Error("Connection failed");

      mockAxiosPost.mockRejectedValue(genericError);
      mockIsAxiosError.mockReturnValue(false);

      await expect(
        SHService.sendSignal(mockPayload, mockToken)
      ).rejects.toThrow("Connection failed");

      expect(mockLogger.error).toHaveBeenCalledWith(
        `[ANPRService] Connection Error: Connection failed`
      );
    });
  });

  describe("findSeedByEserviceId", () => {
    const eserviceId = "eservice-seed-123";

    it("should return the seed if found", async () => {
      const expectedSeed = "my-secret-seed-value";
      mockFindConfigByEserviceId.mockResolvedValue(expectedSeed);

      const result = await SHService.findSeedByEserviceId(eserviceId);

      expect(result).toBe(expectedSeed);
      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SeedRepository] Searching for seed for e-service: ${eserviceId}`
      );
      expect(mockFindConfigByEserviceId).toHaveBeenCalledWith(eserviceId);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should throw and log if seed is null", async () => {
      mockFindConfigByEserviceId.mockResolvedValue(null);

      await expect(SHService.findSeedByEserviceId(eserviceId)).rejects.toThrow(
        "Error retrieving seed from DB."
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SeedRepository] 'seed' field is null in JSONB for ${eserviceId}`
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SeedRepository] DB Error: Null or malformed seed in JSONB for ${eserviceId}`
      );
    });

    it("should throw and log if repository fails", async () => {
      const dbError = new Error("Repository connection failed");
      mockFindConfigByEserviceId.mockRejectedValue(dbError);

      await expect(SHService.findSeedByEserviceId(eserviceId)).rejects.toThrow(
        "Error retrieving seed from DB."
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SeedRepository] DB Error: ${dbError.message}`
      );
    });
  });

  describe("getNextSignalId", () => {
    const eserviceId = "eservice-inc-456";

    it("should return the next signalId from repository", async () => {
      const nextId = 101;
      mockEnsureAndIncrementSignalId.mockResolvedValue(nextId);

      const result = await SHService.getNextSignalId(eserviceId);

      expect(result).toBe(nextId);
      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SHService] Requesting signalId increment for ${eserviceId}`
      );
      expect(mockEnsureAndIncrementSignalId).toHaveBeenCalledWith(eserviceId);
    });

    it("should re-throw errors from repository", async () => {
      const repoError = new Error("Upsert failed");
      mockEnsureAndIncrementSignalId.mockRejectedValue(repoError);

      await expect(SHService.getNextSignalId(eserviceId)).rejects.toThrow(
        "Upsert failed"
      );
    });
  });
});
