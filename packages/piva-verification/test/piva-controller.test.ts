import { describe, it, expect, vi, beforeEach } from "vitest";
import { PivaVerificationService, userService } from "pdnd-common";
import pivaVerificationController from "../src/controllers/pivaVerificationController.js";
import type {
  Richiesta,
  VerificaPartitaIva,
} from "../src/model/domain/models.js";
vi.mock("../src/config/config.js", () => ({
  pivaVerificationConfig: {
    M2M_KMS_KID: "mock-kid",
    M2M_CLIENT_ID: "mock-client",
  },
}));

vi.mock("pdnd-common", async (importOriginal) => {
  const actual = await importOriginal<typeof import("pdnd-common")>();
  return {
    ...actual,
    PivaVerificationService: {
      getByPiva: vi.fn(),
    },
    userService: {
      generateSeed: vi.fn(),
    },
    getContext: vi.fn(() => ({})),
    logger: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
  };
});

vi.mock("../src/exceptions/errors.js", () => ({
  requestParamNotValid: vi.fn((message) => new Error(message)),
}));

describe("PivaVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PivaVerificationService.getByPiva).mockReset();
    vi.mocked(userService.generateSeed).mockReset();
  });

  it("should return correct data for a valid request", async () => {
    const request: Richiesta = { organizationId: "IT12345678901" };
    const mockData = {
      piva: "IT12345678901",
      ragioneSociale: "Test Corp",
      organizationId: "IT12345678901",
    };

    vi.mocked(PivaVerificationService.getByPiva).mockResolvedValue(mockData);

    const expectedResult: VerificaPartitaIva = {
      data: mockData,
    };

    const result = await pivaVerificationController.findPiva(request);

    expect(result).toEqual(expectedResult);
    expect(PivaVerificationService.getByPiva).toHaveBeenCalledWith(
      "IT12345678901"
    );
  });

  it("should throw an error if organizationId is missing", async () => {
    const request = { organizationId: undefined } as unknown as Richiesta;

    await expect(pivaVerificationController.findPiva(request)).rejects.toThrow(
      "The request body has one or more required param not valid"
    );
    expect(PivaVerificationService.getByPiva).not.toHaveBeenCalled();
  });

  it("should throw the error raised by the external service", async () => {
    const request: Richiesta = { organizationId: "IT12345678901" };
    const externalError = new Error("External service error");

    vi.mocked(PivaVerificationService.getByPiva).mockRejectedValue(
      externalError
    );

    await expect(pivaVerificationController.findPiva(request)).rejects.toThrow(
      externalError
    );
    expect(PivaVerificationService.getByPiva).toHaveBeenCalledWith(
      "IT12345678901"
    );
  });
});
