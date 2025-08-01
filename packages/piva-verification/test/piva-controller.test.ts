import { describe, it, expect, vi, beforeEach } from "vitest";
import pivaVerificationController from "../src/controllers/pivaVerificationController.js";
import type {
  Richiesta,
  VerificaPartitaIva,
} from "../src/model/domain/models.js";

const mockPivaVerificationService = {
  getByPiva: vi.fn(),
};

vi.mock("pdnd-common", () => ({
  PivaVerificationService: mockPivaVerificationService,
  getContext: () => ({}),
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("../exceptions/errors", () => ({
  requestParamNotValid: (message: string | undefined) => new Error(message),
}));

describe("PivaVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dovrebbe restituire i dati corretti per una richiesta valida", async () => {
    const request: Richiesta = { organizationId: "IT12345678901" };
    const mockData = {
      piva: "IT12345678901",
      ragioneSociale: "Test S.p.A.",
    };

    mockPivaVerificationService.getByPiva.mockResolvedValue(mockData);

    const expectedResult: VerificaPartitaIva = {
      data: mockData,
    };

    const result = await pivaVerificationController.findPiva(request);
    expect(result).toEqual(expectedResult);
    expect(mockPivaVerificationService.getByPiva).toHaveBeenCalledWith(
      "IT12345678901",
    );
  });

  it("dovrebbe lanciare un errore se organizationId è assente", async () => {
    const request: Richiesta = { organizationId: undefined };

    await expect(pivaVerificationController.findPiva(request)).rejects.toThrow(
      "The request body has one or more required param not valid",
    );
    expect(mockPivaVerificationService.getByPiva).not.toHaveBeenCalled();
  });

  it("dovrebbe lanciare l'errore sollevato dal servizio esterno", async () => {
    const request: Richiesta = { organizationId: "IT12345678901" };
    const externalError = new Error("Errore del servizio esterno");

    mockPivaVerificationService.getByPiva.mockRejectedValue(externalError);

    await expect(pivaVerificationController.findPiva(request)).rejects.toThrow(
      externalError,
    );
    expect(mockPivaVerificationService.getByPiva).toHaveBeenCalledWith(
      "IT12345678901",
    );
  });
});
