import { describe, it, vi, beforeEach, expect } from "vitest";
import type { HandshakeModel } from "pdnd-models";

const sampleHandshake: HandshakeModel = {
  apikey: "test-api-key",
  cert: "test-cert",
};

// Reset mocks before every test
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

// Mocks with deep structure
const insertMock = vi.fn();
const selectMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("../../src/index", async () => ({
  client: {
    insert: insertMock,
    select: selectMock,
    delete: deleteMock,
  },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../src/db/index", async () => ({
  handshakes: {
    apikey: "apikey",
    cert: "cert",
  },
}));

describe("dataPreparationHandshakeRepository", () => {
  describe("saveList", () => {
    it("does not call insert if list is empty", async () => {
      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      await expect(repo.saveList([])).resolves.toBeUndefined();
      expect(insertMock).not.toHaveBeenCalled();
    });

    it("calls insert and update on conflict", async () => {
      const onConflictDoUpdate = vi.fn();
      const values = vi.fn().mockReturnValue({ onConflictDoUpdate });
      insertMock.mockReturnValue({ values });

      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      await repo.saveList([sampleHandshake]);

      expect(insertMock).toHaveBeenCalled();
      expect(values).toHaveBeenCalledWith([
        { apikey: sampleHandshake.apikey, cert: sampleHandshake.cert },
      ]);
      expect(onConflictDoUpdate).toHaveBeenCalled();
    });
  });

  describe("findAllByKey", () => {
    it("returns all records", async () => {
      const from = vi.fn().mockResolvedValueOnce([sampleHandshake]);
      selectMock.mockReturnValue({ from });

      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      const result = await repo.findAllByKey();

      expect(result).toEqual([sampleHandshake]);
    });

    it("throws on DB error", async () => {
      const from = vi.fn().mockRejectedValueOnce(new Error("fail"));
      selectMock.mockReturnValue({ from });

      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      await expect(repo.findAllByKey()).rejects.toThrow("fail");
    });
  });

  describe("findByApikey", () => {
    it("returns one record if found", async () => {
      const limit = vi.fn().mockResolvedValue([sampleHandshake]);
      const where = vi.fn().mockReturnValue({ limit });
      const from = vi.fn().mockReturnValue({ where });
      selectMock.mockReturnValue({ from });

      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      const result = await repo.findByApikey("test-api-key");

      expect(result).toEqual(sampleHandshake);
    });

    it("returns null if not found", async () => {
      const limit = vi.fn().mockResolvedValue([]);
      const where = vi.fn().mockReturnValue({ limit });
      const from = vi.fn().mockReturnValue({ where });
      selectMock.mockReturnValue({ from });

      const repo = (
        await import(
          "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
        )
      ).dataPreparationHandshakeRepository;
      const result = await repo.findByApikey("not-found");

      expect(result).toBeNull();
    });
  });

  it("deletes all records and returns 0", async () => {
    deleteMock.mockReturnValue({
      from: vi.fn().mockResolvedValueOnce([]), // ensure Promise is resolved
    });

    const repo = (
      await import(
        "../../src/repositories/handshake/dataPreparationHandshakeRepository.js"
      )
    ).dataPreparationHandshakeRepository;

    const result = await repo.deleteAllByKey();

    expect(deleteMock).toHaveBeenCalled();
    expect(result).toBe(0);
  });
});
