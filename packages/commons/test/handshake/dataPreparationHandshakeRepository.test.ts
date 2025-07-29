import { describe, it, expect, vi, afterEach } from "vitest";
import type { HandshakeModel } from "pdnd-models";
import { dataPreparationHandshakeRepository } from "../../src/repositories/handshake/dataPreparationHandshakeRepository.js";

const { mockClient, mockDbChain, mockLogger } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    then: vi.fn(),
  };

  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
    select: vi.fn().mockReturnValue(mockDbChain),
    delete: vi.fn().mockReturnValue(mockDbChain),
  };

  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
  };

  return { mockClient, mockDbChain, mockLogger };
});

vi.mock("pdnd-common", () => ({
  client: mockClient,
  logger: mockLogger,
}));

describe("dataPreparationHandshakeRepository", () => {
  const sampleHandshake: HandshakeModel = {
    apikey: "key-123",
    cert: "cert-abc",
  };
  const sampleHandshakeList: HandshakeModel[] = [
    sampleHandshake,
    { apikey: "key-456", cert: "cert-def" },
  ];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveList", () => {
    it("dovrebbe eseguire un'operazione di upsert (insert with onConflict)", async () => {
      vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
        resolve(undefined)
      );
      await dataPreparationHandshakeRepository.saveList([sampleHandshake]);
      expect(mockClient.insert).toHaveBeenCalled();
      expect(mockDbChain.values).toHaveBeenCalledWith([
        { apikey: sampleHandshake.apikey, cert: sampleHandshake.cert },
      ]);
      expect(mockDbChain.onConflictDoUpdate).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });

  describe("findAllByKey", () => {
    it("dovrebbe trovare e restituire tutti i dati", async () => {
      vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
        resolve(sampleHandshakeList)
      );

      const result = await dataPreparationHandshakeRepository.findAllByKey();

      expect(mockClient.select).toHaveBeenCalled();
      expect(result).toEqual(sampleHandshakeList);
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });

  describe("findByApikey", () => {
    it("dovrebbe trovare e restituire un dato per apikey", async () => {
      vi.mocked(mockDbChain.limit).mockResolvedValue([sampleHandshake]);
      const result = await dataPreparationHandshakeRepository.findByApikey(
        "key-123"
      );
      expect(mockClient.select).toHaveBeenCalled();
      expect(mockDbChain.where).toHaveBeenCalled();
      expect(result).toEqual(sampleHandshake);
    });

    it("dovrebbe restituire null se non trova dati", async () => {
      vi.mocked(mockDbChain.limit).mockResolvedValue([]);
      const result = await dataPreparationHandshakeRepository.findByApikey(
        "key-non-existent"
      );
      expect(result).toBeNull();
    });
  });

  describe("deleteAllByKey", () => {
    it("dovrebbe cancellare tutti i dati e restituire 0", async () => {
      vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
        resolve(undefined)
      );
      const result = await dataPreparationHandshakeRepository.deleteAllByKey();
      expect(mockClient.delete).toHaveBeenCalled();
      expect(result).toBe(0);
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });
});
