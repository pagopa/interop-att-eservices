import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { PartitaIvaModel } from "pdnd-models";
import { PivaVerificationService } from "../../src/services/piva-verification/index.js";
import { PivaRepository } from "../../src/repositories/piva-verification/piva.js";

vi.mock("../../src/repositories/piva-verification/piva.js", () => ({
  PivaRepository: {
    getPivaObjectByKey: vi.fn(),
    setPivaObject: vi.fn(),
    getAllPivaObject: vi.fn(),
    deleteAllPivaObject: vi.fn(),
    deletePivaObjectByKey: vi.fn(),
  },
}));

vi.mock("../../src/index.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("PivaVerificationService", () => {
  const pivaModel: PartitaIvaModel = { organizationId: "12345678901" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveList", () => {
    it("should save the VAT number if it does not exist and return the model", async () => {
      (PivaRepository.getPivaObjectByKey as Mock).mockResolvedValue(null);
      (PivaRepository.setPivaObject as Mock).mockResolvedValue(
        pivaModel.organizationId
      );

      const result = await PivaVerificationService.saveList(pivaModel);

      expect(PivaRepository.getPivaObjectByKey).toHaveBeenCalledWith(
        pivaModel.organizationId
      );
      expect(PivaRepository.setPivaObject).toHaveBeenCalledWith(
        pivaModel.organizationId
      );
      expect(result).toEqual(pivaModel);
    });

    it("should return null if the VAT number already exists", async () => {
      (PivaRepository.getPivaObjectByKey as Mock).mockResolvedValue(pivaModel);

      const result = await PivaVerificationService.saveList(pivaModel);

      expect(PivaRepository.getPivaObjectByKey).toHaveBeenCalledWith(
        pivaModel.organizationId
      );
      expect(PivaRepository.setPivaObject).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should throw an error if the repository fails", async () => {
      const error = new Error("Repository Error");
      (PivaRepository.getPivaObjectByKey as Mock).mockRejectedValue(error);

      await expect(PivaVerificationService.saveList(pivaModel)).rejects.toThrow(
        error
      );
    });
  });

  describe("getByPiva", () => {
    it("should return a VAT number object if found", async () => {
      (PivaRepository.getPivaObjectByKey as Mock).mockResolvedValue(pivaModel);

      const result = await PivaVerificationService.getByPiva(
        pivaModel.organizationId
      );

      expect(result).toEqual(pivaModel);
    });
  });

  describe("getAll", () => {
    it("should return an array of VAT numbers", async () => {
      const pivaList = [pivaModel];
      (PivaRepository.getAllPivaObject as Mock).mockResolvedValue(pivaList);

      const result = await PivaVerificationService.getAll();

      expect(result).toEqual(pivaList);
    });
  });

  describe("deleteAllByKey", () => {
    it('should return "Success" after deletion', async () => {
      (PivaRepository.deleteAllPivaObject as Mock).mockResolvedValue(undefined);

      const result = await PivaVerificationService.deleteAllByKey();

      expect(result).toBe("Success");
    });
  });

  describe("deleteByPiva", () => {
    it("should return the VAT number model after deletion", async () => {
      (PivaRepository.deletePivaObjectByKey as Mock).mockResolvedValue(
        undefined
      );

      const result = await PivaVerificationService.deleteByPiva(pivaModel);

      expect(PivaRepository.deletePivaObjectByKey).toHaveBeenCalledWith(
        pivaModel.organizationId
      );
      expect(result).toEqual(pivaModel);
    });
  });
});
