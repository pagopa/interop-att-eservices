import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../src/logging/index.js", async () => {
  const actual = await vi.importActual("../../src/logging/index.js");
  return {
    actual,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    certNotValidError: (msg: string): Error => new Error(msg),
  };
});

const mockLoggerInfo = vi.fn();
const mockLoggerError = vi.fn();

vi.mock("../../index.js", () => ({
  client: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    delete: vi.fn(),
  },
  logger: {
    info: mockLoggerInfo,
    error: mockLoggerError,
  },
}));

const mockFindAllByKey = vi.fn();
const mockSaveList = vi.fn();
const mockDeleteAllByKey = vi.fn();
const mockFindByApikey = vi.fn();

vi.mock(
  "../../src/repositories/handshake/dataPreparationHandshakeRepository.js",
  () => ({
    dataPreparationHandshakeRepository: {
      findAllByKey: mockFindAllByKey,
      saveList: mockSaveList,
      deleteAllByKey: mockDeleteAllByKey,
      findByApikey: mockFindByApikey,
    },
  })
);

const mockIsCertUnique = vi.fn();
const mockAppendUnique = vi.fn();

vi.mock("../../src/utility/handshakeUtilities.js", () => ({
  isCertUnique: mockIsCertUnique,
  appendUniqueHandshakeModelsToArray: mockAppendUnique,
}));

import { DataPreparationHandshakeService } from "../../src/services/handshake/dataPreparationHandshakeService.js";
import { HandshakeModel } from "../../src/db/model/handshake.js";

const newHandshake: HandshakeModel = { apikey: "key2", cert: "cert2" };

describe("DataPreparationHandshakeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveList", () => {
    it("should save if no existing data", async () => {
      mockFindAllByKey.mockResolvedValueOnce([]);
      mockIsCertUnique.mockReturnValue(true);
      mockSaveList.mockResolvedValueOnce(undefined);
      mockFindAllByKey.mockResolvedValueOnce([newHandshake]);

      const result = await DataPreparationHandshakeService.saveList(
        newHandshake
      );

      expect(mockFindAllByKey).toHaveBeenCalledTimes(2);
      expect(mockSaveList).toHaveBeenCalledWith([newHandshake]);
      expect(result).toEqual([newHandshake]);
    });
  });
});
