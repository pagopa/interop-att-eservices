import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import type { ResponseRequestDigitalAddressModel } from "pdnd-models";

import { logger, digitalAddressService } from "pdnd-common";
import { appendUniqueFiscalcodeModelsToArray } from "../src/utilities/fiscalcodeUtilities.js";

vi.mock("pdnd-common", async () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(),
  digitalAddressService: {
    findAllDataPreparation: vi.fn(),
    saveDataPreparationList: vi.fn(),
    deleteAllDataPreparation: vi.fn(),
    deleteSingleDataPreparationByFiscalCode: vi.fn(),
    findSingleDataPreparationByFiscalCode: vi.fn(),
  },
}));

vi.mock("../src/utilities/fiscalcodeUtilities.js", async () => ({
  appendUniqueFiscalcodeModelsToArray: vi.fn(),
}));

import controller from "./../src/controllers/DataPreparationController.js";

const mockFiscalCode1: ResponseRequestDigitalAddressModel = {
  fiscalCode: "AAAAAA00A00A000A",
};
const mockFiscalCode2: ResponseRequestDigitalAddressModel = {
  fiscalCode: "BBBBBB00B00B000B",
};

describe("DataPreparationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveList", () => {
    it("should create a new list if no data exists", async () => {
      (digitalAddressService.findAllDataPreparation as Mock).mockResolvedValue(
        []
      );

      const result = await controller.saveList(mockFiscalCode1);

      expect(
        digitalAddressService.saveDataPreparationList
      ).toHaveBeenCalledWith([mockFiscalCode1]);
      expect(result).toBeNull();
    });

    it("should update an existing list with new unique data", async () => {
      const initialList = [mockFiscalCode1];
      const updatedList = [mockFiscalCode1, mockFiscalCode2];

      (
        digitalAddressService.findAllDataPreparation as Mock
      ).mockResolvedValueOnce(initialList);
      (appendUniqueFiscalcodeModelsToArray as Mock).mockReturnValue(
        updatedList
      );
      (
        digitalAddressService.findAllDataPreparation as Mock
      ).mockResolvedValueOnce(updatedList);

      const result = await controller.saveList(mockFiscalCode2);

      expect(appendUniqueFiscalcodeModelsToArray).toHaveBeenCalledWith(
        initialList,
        [mockFiscalCode2]
      );
      expect(
        digitalAddressService.saveDataPreparationList
      ).toHaveBeenCalledWith(updatedList);
      expect(result).toEqual(updatedList);
    });

    it("should throw an error if saving fails", async () => {
      const error = new Error("Database error");
      (digitalAddressService.findAllDataPreparation as Mock).mockRejectedValue(
        error
      );

      await expect(controller.saveList(mockFiscalCode1)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        "saveList [DATA-PREPARATION-CONTROLLER] - Errore durante il salvataggio della lista.",
        error
      );
    });
  });

  describe("getAll", () => {
    it("should return all data from the service", async () => {
      const allData = [mockFiscalCode1, mockFiscalCode2];
      (digitalAddressService.findAllDataPreparation as Mock).mockResolvedValue(
        allData
      );

      const result = await controller.getAll();

      expect(result).toEqual(allData);
      expect(
        digitalAddressService.findAllDataPreparation
      ).toHaveBeenCalledOnce();
    });

    it("should throw an error if retrieval fails", async () => {
      const error = new Error("Failed to fetch");
      (digitalAddressService.findAllDataPreparation as Mock).mockRejectedValue(
        error
      );

      await expect(controller.getAll()).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        "getAll [DATA-PREPARATION-CONTROLLER]: Errore durante il recupero della lista.",
        error
      );
    });
  });

  describe("deleteAllByKey", () => {
    it("should call the delete service and return the number of deleted items", async () => {
      const deletedCount = 5;
      (
        digitalAddressService.deleteAllDataPreparation as Mock
      ).mockResolvedValue(deletedCount);

      const result = await controller.deleteAllByKey();

      expect(result).toBe(deletedCount);
      expect(
        digitalAddressService.deleteAllDataPreparation
      ).toHaveBeenCalledOnce();
    });

    it("should throw an error if deletion fails", async () => {
      const error = new Error("Failed to delete");
      (
        digitalAddressService.deleteAllDataPreparation as Mock
      ).mockRejectedValue(error);

      await expect(controller.deleteAllByKey()).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        "deleteAllByKey [DATA-PREPARATION-CONTROLLER]: Errore durante la cancellazione della lista.",
        error
      );
    });
  });

  describe("deleteByFiscalCode", () => {
    it("should delete a single entry and return the remaining list", async () => {
      const remainingList = [mockFiscalCode2];
      (
        digitalAddressService.deleteSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(undefined);
      (digitalAddressService.findAllDataPreparation as Mock).mockResolvedValue(
        remainingList
      );

      const result = await controller.deleteByFiscalCode("AAAAAA00A00A000A");

      expect(
        digitalAddressService.deleteSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith("AAAAAA00A00A000A");
      expect(result).toEqual(remainingList);
    });

    it("should throw an error if deletion by fiscal code fails", async () => {
      const error = new Error("Failed to delete by fiscal code");
      (
        digitalAddressService.deleteSingleDataPreparationByFiscalCode as Mock
      ).mockRejectedValue(error);

      await expect(
        controller.deleteByFiscalCode("AAAAAA00A00A000A")
      ).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        `deleteByFiscalCode [DATA-PREPARATION-CONTROLLER] - Errore durante l'eliminazione.`,
        error
      );
    });
  });

  describe("findByFiscalCode", () => {
    it("should find and return a single entry by fiscal code", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(mockFiscalCode1);

      const result = await controller.findByFiscalCode("AAAAAA00A00A000A");

      expect(
        digitalAddressService.findSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledWith("AAAAAA00A00A000A");
      expect(result).toEqual(mockFiscalCode1);
    });

    it("should return null if no entry is found", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(null);

      const result = await controller.findByFiscalCode("ZZZZZZ00Z00Z000Z");

      expect(result).toBeNull();
    });

    it("should throw an error if finding by fiscal code fails", async () => {
      const error = new Error("Failed to find by fiscal code");
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockRejectedValue(error);

      await expect(
        controller.findByFiscalCode("AAAAAA00A00A000A")
      ).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        `findByFiscalCode [DATA-PREPARATION-CONTROLLER] - Errore durante il recupero.`,
        error
      );
    });
  });
});
