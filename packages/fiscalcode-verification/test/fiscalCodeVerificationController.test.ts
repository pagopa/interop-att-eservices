import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, FiscalCodeService } from "pdnd-common";
import { Richiesta } from "../src/model/domain/models.js";
import { fiscalcodeModelToVerificaCodiceFiscale } from "../src/model/domain/apiConverter.js";
import controller from "../src/controllers/fiscalcodeVerificationController.js";
vi.mock("../src/model/domain/apiConverter.js", () => ({
  fiscalcodeModelToVerificaCodiceFiscale: vi.fn(),
}));

vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
  FiscalCodeService: {
    getByFiscalCode: vi.fn(),
  },
}));

describe("FiscalcodeVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a valid response when the fiscal code is found", async () => {
    const validFiscalCode = "RSSMRA80A01H501U";
    const mockRequest: Richiesta = { idSubject: validFiscalCode };
    const mockServiceResponse = {
      name: "Mario",
      surname: "Rossi",
      fiscalCode: validFiscalCode,
    };
    const mockConverterResponse = {
      isValid: true,
      message: "Codice fiscale valido",
      fiscalCode: validFiscalCode,
    };
    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(
      mockServiceResponse
    );
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      mockConverterResponse
    );

    const { data } = await controller.findFiscalcode(mockRequest);

    expect(FiscalCodeService.getByFiscalCode).toHaveBeenCalledWith(
      validFiscalCode
    );
    expect(fiscalcodeModelToVerificaCodiceFiscale).toHaveBeenCalledWith(
      mockServiceResponse,
      true,
      "Codice fiscale valido"
    );
    expect(data).toEqual(mockConverterResponse);
  });

  it("should return an invalid response when the fiscal code is not found", async () => {
    const notFoundFiscalCode = "XXXXXXXXXXXXXXXX";
    const mockRequest: Richiesta = { idSubject: notFoundFiscalCode };
    const mockConverterResponse = {
      isValid: false,
      message: "Codice fiscale non valido",
      fiscalCode: notFoundFiscalCode,
    };

    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(null);
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      mockConverterResponse
    );

    const { data } = await controller.findFiscalcode(mockRequest);

    expect(FiscalCodeService.getByFiscalCode).toHaveBeenCalledWith(
      notFoundFiscalCode
    );
    expect(fiscalcodeModelToVerificaCodiceFiscale).toHaveBeenCalledWith(
      null,
      false,
      "Codice fiscale non valido",
      notFoundFiscalCode
    );
    expect(data).toEqual(mockConverterResponse);
  });
  it("should throw an error if idSubject is missing", async () => {
    const invalidRequest: Richiesta = { idSubject: undefined };
    await expect(controller.findFiscalcode(invalidRequest)).rejects.toThrow();
  });

  it("should re-throw and log an error if FiscalCodeService fails", async () => {
    const mockRequest: Richiesta = { idSubject: "ANY_CODE" };
    const mockError = new Error("Database connection error");
    vi.mocked(FiscalCodeService.getByFiscalCode).mockRejectedValue(mockError);
    await expect(controller.findFiscalcode(mockRequest)).rejects.toThrow(
      "Database connection error"
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
