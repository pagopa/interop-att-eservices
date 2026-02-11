import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { logger, digitalAddressService } from "pdnd-common";
import { fiscalcodeNotFound } from "../src/exceptions/errors.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../src/model/domain/apiConverter.js";

vi.mock("pdnd-common", async () => {
  const actual = await vi.importActual<typeof import("pdnd-common")>(
    "pdnd-common"
  );

  return {
    ...actual,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    getContext: vi.fn(),
    digitalAddressService: {
      findSingleDataPreparationByFiscalCode: vi.fn(),
    },
  };
});

vi.mock("../src/exceptions/errors.js", async () => ({
  fiscalcodeNotFound: vi.fn((msg) => new Error(msg)),
}));

vi.mock("../src/model/domain/apiConverter.js", async () => ({
  responseRequestDigitalAddressModelToResponseRequestDigitalAddress: vi.fn(),
}));

import controller from "../src/controllers/digitalAddressVerificationSingleController.js";

const mockDbRecord = {
  fiscalCode: "AAAAAA00A00A000A",
  digitalAddress: [{ digitalAddress: "test@pec.it" }],
  from: "2025-01-01T00:00:00.000Z",
};

const mockConvertedRecord = {
  fiscalCode: "AAAAAA00A00A000A",
  domicili: [{ tipo: "digitale", indirizzo: "test@pec.it" }],
};

describe("DigitalAddressVerificationSingleController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("verify", () => {
    it("should return true when user, address, and date are all valid", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(mockDbRecord);

      const result = await controller.verify(
        "AAAAAA00A00A000A",
        "test@pec.it",
        "2025-02-01T00:00:00.000Z"
      );

      expect(result.result).toBe(true);
      expect(result.timestampCheck).toBeDefined();
    });

    it("should return false if the digital address does not match", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(mockDbRecord);

      const result = await controller.verify(
        "AAAAAA00A00A000A",
        "wrong@pec.it",
        "2025-02-01T00:00:00.000Z"
      );

      expect(result.result).toBe(false);
    });

    it("should return false if the 'from' date is not valid", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(mockDbRecord);

      const result = await controller.verify(
        "AAAAAA00A00A000A",
        "test@pec.it",
        "2024-12-31T00:00:00.000Z"
      );

      expect(result.result).toBe(false);
    });

    it("should return false if the user is not found", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(null);

      const result = await controller.verify(
        "ZZZZZZ00Z00Z000Z",
        "test@pec.it",
        "2025-02-01T00:00:00.000Z"
      );

      expect(result.result).toBe(false);
    });

    it("should throw an error if the service fails", async () => {
      const error = new Error("Database connection failed");
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockRejectedValue(error);

      await expect(
        controller.verify(
          "AAAAAA00A00A000A",
          "test@pec.it",
          "2025-02-01T00:00:00.000Z"
        )
      ).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("extract", () => {
    it("should return converted user data when user is found", async () => {
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(mockDbRecord);
      (
        responseRequestDigitalAddressModelToResponseRequestDigitalAddress as Mock
      ).mockReturnValue(mockConvertedRecord);

      const result = await controller.extract("AAAAAA00A00A000A");

      expect(
        responseRequestDigitalAddressModelToResponseRequestDigitalAddress
      ).toHaveBeenCalledWith(mockDbRecord);
      expect(result).toEqual(mockConvertedRecord);
    });

    it("should throw fiscalcodeNotFound error if user is not found", async () => {
      const idSubject = "ZZZZZZ00Z00Z000Z";
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockResolvedValue(null);

      await expect(controller.extract(idSubject)).rejects.toThrow(
        `The fiscal code not found: ${idSubject}`
      );
      expect(fiscalcodeNotFound).toHaveBeenCalledWith(
        `The fiscal code not found: ${idSubject}`
      );
    });

    it("should throw an error if the service fails", async () => {
      const error = new Error("Database connection failed");
      (
        digitalAddressService.findSingleDataPreparationByFiscalCode as Mock
      ).mockRejectedValue(error);

      await expect(controller.extract("AAAAAA00A00A000A")).rejects.toThrow(
        error
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
