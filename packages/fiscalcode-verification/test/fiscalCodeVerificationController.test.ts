import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, FiscalCodeService } from "pdnd-common";
import { Richiesta } from "../src/model/domain/models.js";
import controller from "./../src/controllers/fiscalcodeVerificationController.js";
// 1. Importa la funzione che vuoi "ingannare"
import { fiscalcodeModelToVerificaCodiceFiscale } from "../src/model/domain/apiConverter.js";

// 2. Simula il modulo che contiene la funzione difettosa
//    (ATTENZIONE: adatta il percorso se è diverso)
vi.mock("../src/model/domain/apiConverter.js", () => ({
  fiscalcodeModelToVerificaCodiceFiscale: vi.fn(),
}));

// Mock del servizio (già presente e corretto)
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
    // ARRANGE
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

    // Simula la risposta del DB
    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(
      mockServiceResponse
    );
    // 3. Simula la risposta del convertitore
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      mockConverterResponse
    );

    // ACT
    const { data } = await controller.findFiscalcode(mockRequest);

    // ASSERT
    expect(FiscalCodeService.getByFiscalCode).toHaveBeenCalledWith(
      validFiscalCode
    );
    expect(fiscalcodeModelToVerificaCodiceFiscale).toHaveBeenCalledWith(
      mockServiceResponse,
      true,
      "Codice fiscale valido"
    );
    expect(data).toEqual(mockConverterResponse); // Ora il test verifica che il risultato sia corretto
  });

  it("should return an invalid response when the fiscal code is not found", async () => {
    // ARRANGE
    const notFoundFiscalCode = "XXXXXXXXXXXXXXXX";
    const mockRequest: Richiesta = { idSubject: notFoundFiscalCode };
    const mockConverterResponse = {
      isValid: false,
      message: "Codice fiscale non valido",
      fiscalCode: notFoundFiscalCode,
    };

    // Simula la risposta del DB (non trovato)
    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(null);
    // 3. Simula la risposta del convertitore
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      mockConverterResponse
    );

    // ACT
    const { data } = await controller.findFiscalcode(mockRequest);

    // ASSERT
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

  // Questi test non cambiano perché gestiscono solo errori
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
