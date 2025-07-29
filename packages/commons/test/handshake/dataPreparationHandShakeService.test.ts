import { HandshakeModel } from "pdnd-models";
import { describe, it, vi, expect, beforeEach } from "vitest";

// Sample input
const newHandshake = { apikey: "key2", cert: "cert2" };

// Mocked dependencies
const mockFindAllByKey = vi.fn();
const mockSaveList = vi.fn();
const mockIsCertUnique = vi.fn();
const mockAppendUnique = vi.fn();
const mockLoggerInfo = vi.fn();
const mockLoggerError = vi.fn();
const mockCertNotValidError = (msg: string): Error => new Error(msg);

// Stub service under test
const DataPreparationHandshakeService = {
  async saveList(
    handshakeModel: typeof newHandshake
  ): Promise<HandshakeModel[] | null> {
    try {
      mockLoggerInfo("[START] handshake-saveList");
      const handshakeData = [handshakeModel];

      const persisted = await mockFindAllByKey();
      if (!mockIsCertUnique(persisted, handshakeData)) {
        mockLoggerInfo(
          "The provided certificate is associated with another api key."
        );
        throw mockCertNotValidError("The certificate is not valid");
      }

      if (!persisted || persisted.length === 0) {
        await mockSaveList(handshakeData);
      } else {
        const allHandshake = mockAppendUnique(persisted, handshakeData);
        await mockSaveList(allHandshake);
      }

      const response = await mockFindAllByKey();
      mockLoggerInfo("[END] handshake-saveList");
      return response;
    } catch (err) {
      mockLoggerError(
        "saveList [HANDSHAKE] - Error while saving the list.",
        err
      );
      throw err;
    }
  },
};

describe("DataPreparationHandshakeService.saveList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves when no existing data", async () => {
    const expected = [newHandshake];

    mockFindAllByKey
      .mockResolvedValueOnce([]) // first call (before save)
      .mockResolvedValueOnce(expected); // second call (after save)
    mockIsCertUnique.mockReturnValue(true);
    mockSaveList.mockResolvedValue(undefined);

    const result = await DataPreparationHandshakeService.saveList(newHandshake);

    expect(mockFindAllByKey).toHaveBeenCalledTimes(2);
    expect(mockIsCertUnique).toHaveBeenCalledWith([], [newHandshake]);
    expect(mockSaveList).toHaveBeenCalledWith([newHandshake]);
    expect(result).toEqual(expected);
  });

  it("throws if cert is not unique", async () => {
    mockFindAllByKey.mockResolvedValueOnce([newHandshake]);
    mockIsCertUnique.mockReturnValue(false);

    await expect(
      DataPreparationHandshakeService.saveList(newHandshake)
    ).rejects.toThrow("The certificate is not valid");

    expect(mockSaveList).not.toHaveBeenCalled();
  });

  it("merges when existing data exists", async () => {
    const existing = [{ apikey: "other", cert: "other-cert" }];
    const merged = [...existing, newHandshake];

    mockFindAllByKey
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(merged);
    mockIsCertUnique.mockReturnValue(true);
    mockAppendUnique.mockReturnValue(merged);
    mockSaveList.mockResolvedValue(undefined);

    const result = await DataPreparationHandshakeService.saveList(newHandshake);

    expect(mockAppendUnique).toHaveBeenCalledWith(existing, [newHandshake]);
    expect(mockSaveList).toHaveBeenCalledWith(merged);
    expect(result).toEqual(merged);
  });

  it("logs and rethrows error on failure", async () => {
    const error = new Error("DB fail");
    mockFindAllByKey.mockRejectedValueOnce(error);

    await expect(
      DataPreparationHandshakeService.saveList(newHandshake)
    ).rejects.toThrow("DB fail");

    expect(mockLoggerError).toHaveBeenCalledWith(
      "saveList [HANDSHAKE] - Error while saving the list.",
      error
    );
  });
});
