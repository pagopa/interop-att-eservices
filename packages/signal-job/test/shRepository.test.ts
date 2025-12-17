import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { signalCounters } from "pdnd-common";
import { sql } from "drizzle-orm";
import { SHRepository } from "../src/repositories/SHRepository.js";

type MockDbChain = {
  select: Mock;
  from: Mock;
  insert: Mock;
  values: Mock;
  onConflictDoUpdate: Mock;
  returning: Mock;
  execute: Mock;
};

const mockDbChain: MockDbChain = {
  select: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  onConflictDoUpdate: vi.fn(),
  returning: vi.fn(),
  execute: vi.fn(),
};

vi.mock("pdnd-common", () => ({
  get client(): MockDbChain {
    return mockDbChain;
  },
  signalCounters: {
    eserviceId: "eservice_id_col",
    signalId: "signal_id_col",
  },
}));

vi.mock("drizzle-orm", () => ({
  sql: vi.fn((parts) => parts.join("")),
}));

describe("SHRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDbChain.select.mockReturnThis();
    mockDbChain.from.mockReturnThis();
    mockDbChain.insert.mockReturnThis();
    mockDbChain.values.mockReturnThis();
    mockDbChain.onConflictDoUpdate.mockReturnThis();
    mockDbChain.returning.mockReturnThis();
    mockDbChain.execute.mockReset();
  });

  describe("getAllEserviceIds", () => {
    it("should return an array of e-service IDs", async () => {
      const mockRows = [
        { eserviceId: "e-service-1" },
        { eserviceId: "e-service-2" },
      ];
      mockDbChain.execute.mockResolvedValue(mockRows);

      const ids = await SHRepository.getAllEserviceIds();

      expect(ids).toEqual(["e-service-1", "e-service-2"]);
      expect(mockDbChain.select).toHaveBeenCalledWith({
        eserviceId: signalCounters.eserviceId,
      });
      expect(mockDbChain.from).toHaveBeenCalledWith(signalCounters);
      expect(mockDbChain.execute).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no rows are found", async () => {
      mockDbChain.execute.mockResolvedValue([]);
      const ids = await SHRepository.getAllEserviceIds();
      expect(ids).toEqual([]);
    });

    it("should throw an error if the database query fails", async () => {
      const dbError = new Error("DB Connection Failed");
      mockDbChain.execute.mockRejectedValue(dbError);

      await expect(SHRepository.getAllEserviceIds()).rejects.toThrow(
        "DB Connection Failed"
      );
    });
  });

  describe("ensureAndIncrementSignalId", () => {
    it("should insert or update and return the new signal ID", async () => {
      const mockResult = [{ newId: 5 }];
      mockDbChain.execute.mockResolvedValue(mockResult);

      const newId = await SHRepository.ensureAndIncrementSignalId(
        "e-service-x"
      );

      expect(newId).toBe(5);
      expect(mockDbChain.insert).toHaveBeenCalledWith(signalCounters);
      expect(mockDbChain.values).toHaveBeenCalledWith({
        eserviceId: "e-service-x",
        signalId: 1,
      });
      expect(mockDbChain.onConflictDoUpdate).toHaveBeenCalledWith({
        target: signalCounters.eserviceId,
        set: { signalId: sql`${signalCounters.signalId} + 1` },
      });
      expect(mockDbChain.returning).toHaveBeenCalledWith({
        newId: signalCounters.signalId,
      });
      expect(mockDbChain.execute).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the database returns no results", async () => {
      mockDbChain.execute.mockResolvedValue([]);

      await expect(
        SHRepository.ensureAndIncrementSignalId("e-service-fail")
      ).rejects.toThrow("Failed to increment signalId for e-service-fail");
    });

    it("should throw an error if the insert operation fails", async () => {
      const dbError = new Error("Insert Failed");
      mockDbChain.execute.mockRejectedValue(dbError);

      await expect(
        SHRepository.ensureAndIncrementSignalId("e-service-fail")
      ).rejects.toThrow("Insert Failed");
    });
  });
});
