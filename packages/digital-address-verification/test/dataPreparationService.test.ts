/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, getContext } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import DataPreparationService from "../../../src/services/dataPreparationService.js";
import dataPreparationRepository from "../../../src/repository/dataPreparationRepository.js";
import { appendUniqueFiscalcodeModelsToArray } from "../../../src/utilities/fiscalcodeUtilities.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(),
}));

vi.mock("../../../src/repository/dataPreparationRepository.js", () => ({
  default: {
    saveList: vi.fn(),
    findAllByKey: vi.fn(),
    findByFiscalCode: vi.fn(),
    deleteAllByKey: vi.fn(),
    deleteSingleByFiscalCode: vi.fn(),
  },
}));

vi.mock("../../../src/utilities/fiscalcodeUtilities.js", () => ({
  appendUniqueFiscalcodeModelsToArray: vi.fn(),
}));

describe("DataPreparationService", () => {
  // eslint-disable-next-line functional/no-let
  let service: typeof DataPreparationService = DataPreparationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = DataPreparationService;
    (getContext as ReturnType<typeof vi.fn>).mockReturnValue({});
  });

  describe("saveList", () => {
    const mockFiscalCodeModel: ResponseRequestDigitalAddressModel = {
      idSubject: "FC1",
      from: new Date().toISOString(),
      digitalAddress: [],
    };

    it("should save a new list if no existing data is found", async () => {
      (dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
      (dataPreparationRepository.saveList as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      const result = await service.saveList(mockFiscalCodeModel);

      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(1);
      expect(dataPreparationRepository.saveList).toHaveBeenCalledWith([mockFiscalCodeModel]);
      expect(appendUniqueFiscalcodeModelsToArray).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should append to existing list and save if data is found", async () => {
      const existingData: ResponseRequestDigitalAddressModel[] = [
        { idSubject: "FC_EXISTING", from: new Date().toISOString(), digitalAddress: [] },
      ];
      const mergedData: ResponseRequestDigitalAddressModel[] = [...existingData, mockFiscalCodeModel];

      (dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingData);
      (appendUniqueFiscalcodeModelsToArray as ReturnType<typeof vi.fn>).mockReturnValueOnce(mergedData);
      (dataPreparationRepository.saveList as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
      (dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mergedData);

      const result = await service.saveList(mockFiscalCodeModel);

      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(2);
      expect(appendUniqueFiscalcodeModelsToArray).toHaveBeenCalledWith(
        existingData,
        [mockFiscalCodeModel]
      );
      expect(dataPreparationRepository.saveList).toHaveBeenCalledWith(
        mergedData
      );
      expect(result).toEqual(mergedData);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should log an error and rethrow it if saving fails", async () => {
      const mockError = new Error("Save list error");
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(mockError);

      await expect(service.saveList(mockFiscalCodeModel)).rejects.toThrow(
        mockError
      );
      expect(logger.error).toHaveBeenCalledWith(
        "saveList [DATA-PREPARATION]- Errore durante il salvataggio della lista.",
        mockError
      );
    });
  });

  describe("getAll", () => {
    it("should retrieve and return all data", async () => {
      const mockData: ResponseRequestDigitalAddressModel[] = [
        {
          idSubject: "FC1",
          from: new Date().toISOString(),
          digitalAddress: [],
        },
      ];
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(mockData);

      const result = await service.getAll();

      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should return null if no data is found", async () => {
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const result = await service.getAll();

      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should log an error and rethrow it if retrieval fails", async () => {
      const mockError = new Error("Get all error");
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(mockError);

      await expect(service.getAll()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "getAll [DATA-PREPARATION]: Errore durante il recupero della lista.",
        mockError
      );
    });
  });

  describe("deleteAllByKey", () => {
    it("should delete all data and return the count", async () => {
      const mockDeletedCount = 2;
      (
        dataPreparationRepository.deleteAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(mockDeletedCount);

      const result = await service.deleteAllByKey();

      expect(dataPreparationRepository.deleteAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockDeletedCount);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should return null if no data was deleted (or 0 as per repo)", async () => {
      (
        dataPreparationRepository.deleteAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(0);

      const result = await service.deleteAllByKey();

      expect(dataPreparationRepository.deleteAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toBe(0);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should log an error and rethrow it if deletion fails", async () => {
      const mockError = new Error("Delete all error");
      (
        dataPreparationRepository.deleteAllByKey as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(mockError);

      await expect(service.deleteAllByKey()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "datapreparationService [DATA-PREPARATION]: Errore durante la cancellazione della lista. ",
        mockError
      );
    });
  });

  describe("deleteByFiscalCode", () => {
    const mockUuid = "some-uuid";
    const mockRemainingData: ResponseRequestDigitalAddressModel[] = [
      {
        idSubject: "FC_REMAINING",
        from: new Date().toISOString(),
        digitalAddress: [],
      },
    ];

    it("should delete by fiscal code and return remaining data", async () => {
      (
        dataPreparationRepository.deleteSingleByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValueOnce(1);
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(mockRemainingData);

      const result = await service.deleteByFiscalCode(mockUuid);

      expect(
        dataPreparationRepository.deleteSingleByFiscalCode
      ).toHaveBeenCalledWith(mockUuid);
      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRemainingData);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should return null if no remaining data after deletion", async () => {
      (
        dataPreparationRepository.deleteSingleByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValueOnce(0);
      (
        dataPreparationRepository.findAllByKey as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const result = await service.deleteByFiscalCode(mockUuid);

      expect(
        dataPreparationRepository.deleteSingleByFiscalCode
      ).toHaveBeenCalledWith(mockUuid);
      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should log an error and rethrow it if deletion fails", async () => {
      const mockError = new Error("Delete by fiscal code error");
      (
        dataPreparationRepository.deleteSingleByFiscalCode as ReturnType<
          typeof vi.fn
        >
      ).mockRejectedValueOnce(mockError);

      await expect(service.deleteByFiscalCode(mockUuid)).rejects.toThrow(
        mockError
      );
      expect(logger.error).toHaveBeenCalledWith(
        "deleteByFiscalcode - Errore durante l'eliminazione.",
        mockError
      );
    });
  });

  describe("findByFiscalCode", () => {
    it("should retrieve and return data for a specific fiscal code", async () => {
      const mockFiscalCode = "FC_FOUND";
      const mockFoundData: ResponseRequestDigitalAddressModel = {
        idSubject: mockFiscalCode,
        from: new Date().toISOString(),
        digitalAddress: [],
      };
      (
        dataPreparationRepository.findByFiscalCode as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(mockFoundData);

      const result = await service.findByFiscalCode(mockFiscalCode);

      expect(dataPreparationRepository.findByFiscalCode).toHaveBeenCalledWith(
        mockFiscalCode
      );
      expect(result).toEqual(mockFoundData);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should return null if fiscal code is not found", async () => {
      const mockFiscalCode = "FC_NOT_FOUND";
      (
        dataPreparationRepository.findByFiscalCode as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const result = await service.findByFiscalCode(mockFiscalCode);

      expect(dataPreparationRepository.findByFiscalCode).toHaveBeenCalledWith(
        mockFiscalCode
      );
      expect(result).toBeNull();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should log an error and rethrow it if retrieval fails", async () => {
      const mockFiscalCode = "FC_ERROR";
      const mockError = new Error("Find by fiscal code error");
      (
        dataPreparationRepository.findByFiscalCode as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(mockError);

      await expect(service.findByFiscalCode(mockFiscalCode)).rejects.toThrow(
        mockError
      );
      expect(logger.error).toHaveBeenCalledWith(
        "findByFiscalCode - Errore durante il recupero.",
        mockError
      );
    });
  });
});
