import { describe, it, expect, vi, afterEach } from "vitest";
import { TrialRepository } from "../../src/repositories/trial-api/index.js";
import { TrialService } from "../../src/services/trial-api/trialService.js";

vi.mock("../../src/repositories/trial-api/index.js", () => ({
  TrialRepository: {
    insert: vi.fn(),
    findByCorrelationId: vi.fn(),
    existCorrelationId: vi.fn(),
  },
}));

describe("TrialService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("insert", () => {
    it("should call TrialRepository.insert with all provided arguments", async () => {
      const operationPath = "/test";
      const operationMethod = "GET";
      const checkName = "SIGNATURE";
      const response = "OK";
      const message = "Completed";

      await TrialService.insert(
        operationPath,
        operationMethod,
        checkName,
        response,
        message
      );

      expect(TrialRepository.insert).toHaveBeenCalledOnce();
      expect(TrialRepository.insert).toHaveBeenCalledWith(
        operationPath,
        operationMethod,
        checkName,
        response,
        message
      );
    });

    it("should call TrialRepository.insert with only required arguments", async () => {
      const operationPath = "/test-minimal";
      const operationMethod = "POST";
      const checkName = "VALIDATION";

      await TrialService.insert(operationPath, operationMethod, checkName);

      expect(TrialRepository.insert).toHaveBeenCalledOnce();
      expect(TrialRepository.insert).toHaveBeenCalledWith(
        operationPath,
        operationMethod,
        checkName,
        undefined,
        undefined
      );
    });
  });

  describe("findByCorrelationId", () => {
    it("should call TrialRepository.findByCorrelationId and return its result", async () => {
      const correlationId = "corr-123";
      const mockResult = [{ id: correlationId, status: "OK" }];
      vi.mocked(TrialRepository.findByCorrelationId).mockResolvedValue(
        mockResult
      );

      const result = await TrialService.findByCorrelationId(correlationId);

      expect(TrialRepository.findByCorrelationId).toHaveBeenCalledOnce();
      expect(TrialRepository.findByCorrelationId).toHaveBeenCalledWith(
        correlationId
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("existCorrelationId", () => {
    it("should call TrialRepository.existCorrelationId and return its result", async () => {
      const correlationId = "corr-456";
      vi.mocked(TrialRepository.existCorrelationId).mockResolvedValue(true);

      const result = await TrialService.existCorrelationId(correlationId);

      expect(TrialRepository.existCorrelationId).toHaveBeenCalledOnce();
      expect(TrialRepository.existCorrelationId).toHaveBeenCalledWith(
        correlationId
      );
      expect(result).toBe(true);
    });
  });
});
