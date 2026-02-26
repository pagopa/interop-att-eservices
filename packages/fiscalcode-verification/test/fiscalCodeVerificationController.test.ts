import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/model/domain/apiConverter.js", () => ({
  fiscalcodeModelToVerificaCodiceFiscale: vi.fn(),
}));

vi.mock("../src/config/config.js", () => ({
  fiscalcodeVerificationConfig: {
    seedExpireDays: 120,
    saltLength: 16,
    algorithm: "sha256",
    startDateMs: "2024-01-01T00:00:00.000Z",
    m2mTokenEndpoint: "http://mock",
    m2mPrivateKeyPath: "/tmp/key",
    m2mClientId: "client-id",
    m2mAuthAudience: "audience",
    m2mRole: "role",
    m2mKmsKid: "kid",
    m2mOrgId: "org",
    signalHubHost: "http://signal-hub",
    signalHubApiVersion: "1.0",
  },
}));

vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
  FiscalCodeService: {
    getByFiscalCode: vi.fn(),
  },
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  fiscalcodeModelToVerificaCodiceFiscale: vi.fn(),
}));

import { FiscalCodeService, logger } from "pdnd-common";
import { fiscalcodeModelToVerificaCodiceFiscale } from "../src/model/domain/apiConverter.js";
import controller from "../src/controllers/fiscalcodeVerificationController.js";
import { Richiesta } from "../src/model/domain/models.js";

describe("FiscalcodeVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a valid response when the fiscal code is found", async () => {
    const validFiscalCode = "RSSMRA80A01H501U";
    const request: Richiesta = { idSubject: validFiscalCode };

    const serviceResponse = {
      name: "Mario",
      surname: "Rossi",
      fiscalCode: validFiscalCode,
    };

    const apiResponse = {
      isValid: true,
      message: "Codice fiscale valido",
      fiscalCode: validFiscalCode,
    };

    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(
      serviceResponse as any
    );
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      apiResponse as any
    );

    const { data } = await controller.findFiscalcode(request);

    expect(data).toEqual(apiResponse);
  });

  it("should return an invalid response when the fiscal code is not found", async () => {
    const invalidFiscalCode = "XXXXXXXXXXXXXXXX";
    const request: Richiesta = { idSubject: invalidFiscalCode };

    const apiResponse = {
      isValid: false,
      message: "Codice fiscale non valido",
      fiscalCode: invalidFiscalCode,
    };

    vi.mocked(FiscalCodeService.getByFiscalCode).mockResolvedValue(null as any);
    vi.mocked(fiscalcodeModelToVerificaCodiceFiscale).mockReturnValue(
      apiResponse as any
    );

    const { data } = await controller.findFiscalcode(request);

    expect(data).toEqual(apiResponse);
  });

  it("should throw an error if idSubject is missing", async () => {
    const request = {} as Richiesta;
    await expect(controller.findFiscalcode(request)).rejects.toThrow();
  });

  it("should re-throw and log an error if FiscalCodeService fails", async () => {
    const request: Richiesta = { idSubject: "ANY_CODE" };
    const error = new Error("Database connection error");

    vi.mocked(FiscalCodeService.getByFiscalCode).mockRejectedValue(error);

    await expect(controller.findFiscalcode(request)).rejects.toThrow(
      "Database connection error"
    );

    expect(logger.error).toHaveBeenCalled();
  });
});