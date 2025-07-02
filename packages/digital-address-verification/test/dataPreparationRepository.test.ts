import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, persistenceService } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import DataPreparationRepository from "../src/repository/dataPreparationRepository.js";

// Mock dependencies
vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  persistenceService: {
    saveDataPreparationList: vi.fn(),
    findAllDataPreparation: vi.fn(),
    findSingleDataPreparationByFiscalCode: vi.fn(),
    deleteAllDataPreparation: vi.fn(),
    deleteSingleDataPreparationByFiscalCode: vi.fn(),
  },
}));

// These mocks are no longer needed, as the repository does not use them directly.
// vi.mock("../../../src/utilities/jsonFiscalcodeUtilities", () => ({
//   parseJsonToResponseRequestDigitalAddressArray: vi.fn(),
// }));
// vi.mock("../../../src/utilities/fiscalcodeUtilities", () => ({
//   findFiscalcodeModelByFiscalcode: vi.fn(),
// }));

describe("DataPreparationRepository", () => {
  const repository: typeof DataPreparationRepository =
    DataPreparationRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveList", () => {
    it("should save the list using persistenceService", async () => {
      const mockRequest: ResponseRequestDigitalAddressModel[] = [
        {
          idSubject: "fiscalCode1",
          from: new Date().toISOString(),
          digitalAddress: [],
        },
      ];

      (
        persistenceService.saveDataPreparationList as ReturnType<typeof vi.fn>
      ).mockResolvedValue(undefined); // It returns Promise<void>

      await repository.saveList(mockRequest);

      expect(persistenceService.saveDataPreparationList).toHaveBeenCalledWith(
        mockRequest
      );
      expect(logger.error).not.toHaveBeenCalled(); // No error expected
    });

    it("should log an error and rethrow it if saving fails", async () => {
      const mockRequest: ResponseRequestDigitalAddressModel[] = [];
      const mockError = new Error("Test saving error");

      (
        persistenceService.saveDataPreparationList as ReturnType<typeof vi.fn>
      ).mockRejectedValue(mockError);

      await expect(repository.saveList(mockRequest)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "dataPreparationRepository: Errore durante il salvataggio della lista: ",
        mockError
      );
    });
  });

  describe("findAllByKey", () => {
    it("should retrieve and return all data from persistenceService", async () => {
      const mockData: ResponseRequestDigitalAddressModel[] = [
        {
          idSubject: "fiscalCode1",
          from: new Date().toISOString(),
          digitalAddress: [],
        },
      ];

      (
        persistenceService.findAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockData);

      const result = await repository.findAllByKey();

      expect(persistenceService.findAllDataPreparation).toHaveBeenCalledTimes(
        1
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(mockData);
    });

    it("should return null if no data is found", async () => {
      (
        persistenceService.findAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      const result = await repository.findAllByKey();

      expect(persistenceService.findAllDataPreparation).toHaveBeenCalledTimes(
        1
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should log an error and rethrow it if retrieval fails", async () => {
      const mockError = new Error("Test retrieval error");

      (
        persistenceService.findAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockRejectedValue(mockError);

      await expect(repository.findAllByKey()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "dataPreparationRepository: Errore durante il recupero degli elementi: ",
        mockError
      );
    });
  });

  describe("findByFiscalCode", () => {
    it("should retrieve and return data for a specific fiscal code", async () => {
      const mockFiscalCode = "fiscalCode123";
      const mockFoundData: ResponseRequestDigitalAddressModel = {
        idSubject: mockFiscalCode,
        from: new Date().toISOString(),
        digitalAddress: [],
      };

      (
        persistenceService.findSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockFoundData);

      const result = await repository.findByFiscalCode(mockFiscalCode);

      expect(
        persistenceService.findSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith(mockFiscalCode);
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(mockFoundData);
    });

    it("should return null if fiscal code is not found", async () => {
      const mockFiscalCode = "nonExistentFiscalCode";
      (
        persistenceService.findSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(null);

      const result = await repository.findByFiscalCode(mockFiscalCode);

      expect(
        persistenceService.findSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith(mockFiscalCode);
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should log an error and rethrow it if retrieval by fiscal code fails", async () => {
      const mockFiscalCode = "testFiscalCode";
      const mockError = new Error("Test find by fiscal code error");

      (
        persistenceService.findSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockRejectedValue(mockError);

      await expect(repository.findByFiscalCode(mockFiscalCode)).rejects.toThrow(
        mockError
      );
      expect(logger.error).toHaveBeenCalledWith(
        "dataPreparationRepository: Errore durante il recupero dell'elemento per codice fiscale: ",
        mockError
      );
    });
  });

  describe("deleteAllByKey", () => {
    it("should delete all data and return the number of deleted items", async () => {
      const mockDeletedCount = 5;
      (
        persistenceService.deleteAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDeletedCount);

      const result = await repository.deleteAllByKey();

      expect(persistenceService.deleteAllDataPreparation).toHaveBeenCalledTimes(
        1
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(mockDeletedCount);
    });

    it("should return 0 if no data was deleted", async () => {
      (
        persistenceService.deleteAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockResolvedValue(0);

      const result = await repository.deleteAllByKey();

      expect(persistenceService.deleteAllDataPreparation).toHaveBeenCalledTimes(
        1
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should log an error and rethrow it if deletion fails", async () => {
      const mockError = new Error("Test deletion error");

      (
        persistenceService.deleteAllDataPreparation as ReturnType<typeof vi.fn>
      ).mockRejectedValue(mockError);

      await expect(repository.deleteAllByKey()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "dataPreparationRepository: Errore durante la cancellazione degli elementi: ",
        mockError
      );
    });
  });

  describe("deleteSingleByFiscalCode", () => {
    it("should delete a single item by fiscal code and return the count", async () => {
      const mockFiscalCode = "fiscalCodeToDelete";
      const mockDeletedCount = 1;
      (
        persistenceService.deleteSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockDeletedCount);

      const result = await repository.deleteSingleByFiscalCode(mockFiscalCode);

      expect(
        persistenceService.deleteSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith(mockFiscalCode);
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(mockDeletedCount);
    });

    it("should return 0 if fiscal code not found for deletion", async () => {
      const mockFiscalCode = "nonExistentFiscalCode";
      (
        persistenceService.deleteSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(0);

      const result = await repository.deleteSingleByFiscalCode(mockFiscalCode);

      expect(
        persistenceService.deleteSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith(mockFiscalCode);
      expect(logger.error).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should log an error and rethrow it if single deletion fails", async () => {
      const mockFiscalCode = "errorFiscalCode";
      const mockError = new Error("Test single deletion error");

      (
        persistenceService.deleteSingleDataPreparationByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockRejectedValue(mockError);

      await expect(
        repository.deleteSingleByFiscalCode(mockFiscalCode)
      ).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "dataPreparationRepository: Errore durante la cancellazione del singolo elemento: ",
        mockError
      );
    });
  });
});
