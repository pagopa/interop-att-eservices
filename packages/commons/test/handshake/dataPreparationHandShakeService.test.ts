import { HandshakeModel } from "pdnd-models";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  certNotValidError,
  DataPreparationHandshakeService,
} from "../../src/index.js";
import { dataPreparationHandshakeRepository } from "../../src/repositories/handshake/dataPreparationHandshakeRepository.js";
import {
  isCertUnique,
  appendUniqueHandshakeModelsToArray,
} from "../../src/utility/handshakeUtilities.js";

vi.mock(
  "../../repositories/handshake/dataPreparationHandshakeRepository.js",
  () => ({
    dataPreparationHandshakeRepository: {
      findAllByKey: vi.fn(),
      saveList: vi.fn(),
      deleteAllByKey: vi.fn(),
      findByApikey: vi.fn(),
    },
  })
);

vi.mock("../../utility/handshakeUtilities.js", () => ({
  isCertUnique: vi.fn(),
  appendUniqueHandshakeModelsToArray: vi.fn(),
}));

vi.mock("../../logging/index.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  certNotValidError: vi.fn((msg: string) => new Error(msg)),
}));

describe("DataPreparationHandshakeService", () => {
  const mockedRepo = vi.mocked(dataPreparationHandshakeRepository);
  const mockedUtils = {
    isCertUnique: vi.mocked(isCertUnique),
    appendUniqueHandshakeModelsToArray: vi.mocked(
      appendUniqueHandshakeModelsToArray
    ),
  };
  const mockedCertError = vi.mocked(certNotValidError);

  const sampleHandshake1: HandshakeModel = { apikey: "key1", cert: "cert1" };
  const sampleHandshake2: HandshakeModel = { apikey: "key2", cert: "cert2" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveList", () => {
    it("dovrebbe salvare un nuovo handshake se il repository è vuoto", async () => {
      mockedRepo.findAllByKey.mockResolvedValueOnce([]);
      mockedUtils.isCertUnique.mockReturnValue(true);
      mockedRepo.saveList.mockResolvedValue(undefined);
      mockedRepo.findAllByKey.mockResolvedValueOnce([sampleHandshake1]);
      const result = await DataPreparationHandshakeService.saveList(
        sampleHandshake1
      );
      expect(mockedRepo.findAllByKey).toHaveBeenCalledTimes(2);
      expect(mockedUtils.isCertUnique).toHaveBeenCalledWith(
        [],
        [sampleHandshake1]
      );
      expect(mockedRepo.saveList).toHaveBeenCalledWith([sampleHandshake1]);
      expect(result).toEqual([sampleHandshake1]);
    });

    it("dovrebbe aggiungere un nuovo handshake a quelli esistenti", async () => {
      const existingData = [sampleHandshake1];
      const newData = sampleHandshake2;
      const combinedData = [sampleHandshake1, sampleHandshake2];

      mockedRepo.findAllByKey.mockResolvedValueOnce(existingData);
      mockedUtils.isCertUnique.mockReturnValue(true);
      mockedUtils.appendUniqueHandshakeModelsToArray.mockReturnValue(
        combinedData
      );
      mockedRepo.saveList.mockResolvedValue(undefined);
      mockedRepo.findAllByKey.mockResolvedValueOnce(combinedData);
      const result = await DataPreparationHandshakeService.saveList(newData);
      expect(
        mockedUtils.appendUniqueHandshakeModelsToArray
      ).toHaveBeenCalledWith(existingData, [newData]);
      expect(mockedRepo.saveList).toHaveBeenCalledWith(combinedData);
      expect(result).toEqual(combinedData);
    });

    it("dovrebbe lanciare un errore se il certificato non è unico", async () => {
      mockedRepo.findAllByKey.mockResolvedValue([sampleHandshake1]);
      mockedUtils.isCertUnique.mockReturnValue(false);
      await expect(
        DataPreparationHandshakeService.saveList(sampleHandshake2)
      ).rejects.toThrow("The certificate is not valid");
      expect(mockedCertError).toHaveBeenCalledWith(
        "The certificate is not valid"
      );
      expect(mockedRepo.saveList).not.toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("dovrebbe restituire tutti gli handshake dal repository", async () => {
      const allData = [sampleHandshake1, sampleHandshake2];
      mockedRepo.findAllByKey.mockResolvedValue(allData);
      const result = await DataPreparationHandshakeService.getAll();
      expect(result).toEqual(allData);
      expect(mockedRepo.findAllByKey).toHaveBeenCalledTimes(1);
    });

    it("dovrebbe lanciare un errore se il repository fallisce", async () => {
      mockedRepo.findAllByKey.mockRejectedValue(
        new Error("DB connection failed")
      );

      await expect(DataPreparationHandshakeService.getAll()).rejects.toThrow(
        "DB connection failed"
      );
    });
  });

  describe("deleteAllByKey", () => {
    it("dovrebbe chiamare il repository per cancellare tutti i dati", async () => {
      mockedRepo.deleteAllByKey.mockResolvedValue(0);
      const result = await DataPreparationHandshakeService.deleteAllByKey();
      expect(result).toBe(0);
      expect(mockedRepo.deleteAllByKey).toHaveBeenCalledTimes(1);
    });
  });

  describe("getByApikey", () => {
    it("dovrebbe restituire un handshake specifico tramite apikey", async () => {
      mockedRepo.findByApikey.mockResolvedValue(sampleHandshake1);
      const result = await DataPreparationHandshakeService.getByApikey("key1");
      expect(result).toEqual(sampleHandshake1);
      expect(mockedRepo.findByApikey).toHaveBeenCalledWith("key1");
    });

    it("dovrebbe restituire null se lapikey non viene trovata", async () => {
      mockedRepo.findByApikey.mockResolvedValue(null);

      const result = await DataPreparationHandshakeService.getByApikey(
        "non-existent-key"
      );

      expect(result).toBeNull();
    });
  });
});
