/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sql } from "drizzle-orm";

// 1. DEFINIRE TUTTI I MOCK CON VI.HOISTED
const {
  mockLogger,
  mockClient,
  mockSignalCounters,
  mockGetRotatedSeed,
  mockExecute,
  mockValues,
  mockOnConflict,
  mockReturning,
} = vi.hoisted(() => {
  // Definisci prima i mock che si concatenano
  const mockExecute = vi.fn();
  const mockReturning = vi.fn(() => ({ execute: mockExecute }));
  const mockOnConflict = vi.fn(() => ({ returning: mockReturning }));
  const mockValues = vi.fn(() => ({ onConflictDoUpdate: mockOnConflict }));
  const mockInsert = vi.fn(() => ({ values: mockValues }));

  // Ritorna tutto come un unico oggetto
  return {
    mockLogger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    mockClient: {
      insert: mockInsert,
    },
    mockSignalCounters: {
      eserviceId: "mockEserviceIdColumn",
      signalId: "mockSignalIdColumn",
    },
    mockGetRotatedSeed: vi.fn(),

    // Includi i mock a catena nel ritorno
    mockExecute,
    mockValues,
    mockOnConflict,
    mockReturning,
  };
});

// 2. ESEGUIRE TUTTI I VI.MOCK USANDO I MOCK DEFINITI
vi.mock("../../src/index.js", () => ({
  logger: mockLogger,
  client: mockClient,
}));

vi.mock("../../src/db/schema/signalHub/index.js", () => ({
  signalCounters: mockSignalCounters,
}));

vi.mock("drizzle-orm", () => ({
  sql: vi.fn(
    (chunks, ...values) =>
      `SQL_MOCK: ${chunks[0]}${values[0] || ""}${chunks[1] || ""}`
  ),
}));

vi.mock("../../src/utility/seedUtility.js", () => ({
  getRotatedSeed: mockGetRotatedSeed,
}));

// 3. SOLO ORA IMPORTARE IL MODULO DA TESTARE
import { SHRepository } from "../../src/repositories/signalHub/index.js";

// 4. ESEGUIRE I TEST
describe("SHRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getSeed", () => {
    it("should return the seed if getRotatedSeed succeeds", async () => {
      const eserviceId = "eservice-123";
      const expectedSeed = "dc977b554769f9cf";
      mockGetRotatedSeed.mockResolvedValue(expectedSeed);

      const result = await SHRepository.getSeed(eserviceId);

      expect(result).toBe(expectedSeed);
      expect(mockGetRotatedSeed).toHaveBeenCalledWith(eserviceId);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should throw and log an error if getRotatedSeed fails", async () => {
      const eserviceId = "eservice-fail";
      const error = new Error("Seed failure");
      mockGetRotatedSeed.mockRejectedValue(error);

      await expect(SHRepository.getSeed(eserviceId)).rejects.toThrow(
        "Seed failure"
      );
      expect(mockGetRotatedSeed).toHaveBeenCalledWith(eserviceId);
    });
  });

  describe("findConfigByEserviceId", () => {
    it("should return the seed if found", async () => {
      const eserviceId = "eservice-abc";
      const expectedSeed = "config-seed-123";

      const getSeedSpy = vi
        .spyOn(SHRepository, "getSeed")
        .mockResolvedValue(expectedSeed);

      const result = await SHRepository.findConfigByEserviceId(eserviceId);

      expect(result).toBe(expectedSeed);
      expect(getSeedSpy).toHaveBeenCalledWith(eserviceId);
      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SHRepository] Finding config for e-service: ${eserviceId}`
      );
    });

    it("should throw an error if the seed is not configured (null or undefined)", async () => {
      const eserviceId = "eservice-no-seed";

      const getSeedSpy = vi
        .spyOn(SHRepository, "getSeed")
        .mockResolvedValue(null as any);

      // --- CORREZIONE 2 ---
      // Il codice lancia un errore diverso da quello che mi aspettavo.
      await expect(
        SHRepository.findConfigByEserviceId(eserviceId)
      ).rejects.toThrow("Error retrieving seed configuration.");

      expect(getSeedSpy).toHaveBeenCalledWith(eserviceId);

      // Aggiorniamo anche il log atteso per coerenza con l'errore
      expect(mockLogger.error).toHaveBeenCalledWith(
        "[SeedRepository] DB Error: Seed non configurato per l'e-service: eservice-no-seed"
      );
    });

    it("should throw a generic error if getSeed fails", async () => {
      const eserviceId = "eservice-db-error";
      const dbError = new Error("DB connection failed");

      const getSeedSpy = vi
        .spyOn(SHRepository, "getSeed")
        .mockRejectedValue(dbError);

      await expect(
        SHRepository.findConfigByEserviceId(eserviceId)
      ).rejects.toThrow("Error retrieving seed configuration.");

      expect(getSeedSpy).toHaveBeenCalledWith(eserviceId);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SeedRepository] DB Error: ${dbError.message}`
      );
    });
  });

  describe("ensureAndIncrementSignalId", () => {
    it("should correctly insert or update and return the new ID", async () => {
      const eserviceId = "eservice-xyz";
      const newSignalId = 124;
      mockExecute.mockResolvedValue([{ newId: newSignalId }]);

      const result = await SHRepository.ensureAndIncrementSignalId(eserviceId);

      expect(result).toBe(newSignalId);

      expect(mockClient.insert).toHaveBeenCalledWith(mockSignalCounters);
      expect(mockValues).toHaveBeenCalledWith({
        eserviceId,
        signalId: 1,
      });
      expect(mockOnConflict).toHaveBeenCalledWith({
        target: mockSignalCounters.eserviceId,
        set: {
          signalId: sql`${mockSignalCounters.signalId} + 1`,
        },
      });
      expect(mockReturning).toHaveBeenCalledWith({
        newId: mockSignalCounters.signalId,
      });
      expect(mockExecute).toHaveBeenCalledTimes(1);

      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SHRepository] New signalId is: ${newSignalId} for ${eserviceId}`
      );
    });

    it("should throw an error if the DB operation returns no results", async () => {
      const eserviceId = "eservice-no-result";
      mockExecute.mockResolvedValue([]);

      // --- CORREZIONE 3 ---
      // Il codice lancia un errore più generico
      await expect(
        SHRepository.ensureAndIncrementSignalId(eserviceId)
      ).rejects.toThrow("DB Error during signalId generation.");

      // Il log dell'errore specifico (Upsert failed) è ancora corretto
      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SHRepository] Upsert operation failed unexpectedly for ${eserviceId}.`
      );
      // --- FINE CORREZIONE 3 ---
    });

    it("should throw an error if the DB fails during execution", async () => {
      const eserviceId = "eservice-db-fail";
      const dbError = new Error("Connection timeout");
      mockExecute.mockRejectedValue(dbError);

      await expect(
        SHRepository.ensureAndIncrementSignalId(eserviceId)
      ).rejects.toThrow("DB Error during signalId generation.");

      expect(mockLogger.error).toHaveBeenCalledWith(
        `[SHRepository] DB Error during signalId upsert: ${dbError.message}`
      );
    });
  });
});
