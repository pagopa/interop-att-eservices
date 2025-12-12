/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { userService, translateKeys, logger } from "pdnd-common";
import { UserModel } from "pdnd-models";
import { userModelNotFound } from "../src/exceptions/errors.js"; // Updated import
import { UserModelToApiTipoDatiSoggettiEnte } from "../src/model/domain/apiConverter.js";
import { RichiestaAR001, RichiestaAR002 } from "../src/model/domain/models.js";
import controller from "../src/controllers/residenceVerificationController.js";
import { RichiestaAR002 } from "../src/model/domain/models.js";
import { RichiestaAR001 } from "../src/model/modelAr001.js";

const mockApiConverter = vi.fn();

const mockZodSchema = {
  and: vi.fn(function () {
    return mockZodSchema;
  }),
  parse: vi.fn(() => ({})),
};

vi.mock("pdnd-common", () => {
  const mockZodSchema = {
    and: vi.fn(function () {
      return mockZodSchema;
    }),
    parse: vi.fn(() => ({})),
  };

  return {
    userModelNotFound: vi.fn((msg) => new Error(msg || "Utente non trovato")),
    userService: {
      getUserBySubjectId: vi.fn(),
      getByPersonalInfo: vi.fn(),
      generateSeed: vi.fn(),
    },
    translateKeys: vi.fn(),
    logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
    LoggerConfig: mockZodSchema,
    DatabaseConfig: mockZodSchema,
    ShConfig: mockZodSchema,
    SignerConfig: mockZodSchema,
    JWTConfig: mockZodSchema,
    ContextConfig: mockZodSchema,
    HTTPServerConfig: mockZodSchema,
  };
});

vi.mock("../config/config.js", () => ({
  residenceVerificationConfig: { seedExpireDays: 7 },
}));

vi.mock("../exceptions/errors.js", () => ({
  userModelNotFound: vi.fn((msg) => new Error(msg || "Utente non trovato")),
}));

vi.mock("../model/domain/apiConverter.js", () => ({
  UserModelToApiTipoDatiSoggettiEnte: mockApiConverter,
}));

vi.mock("../utilities/residence-mappings.js", () => ({
  REQ_ITA_TO_ENG: {},
  RES_ENG_TO_ITA_KEYS: {},
}));

vi.mock("../src/exceptions/errors.js", async () => ({
  userModelNotFound: vi.fn((msg) => new Error(msg || "Utente non trovato")),
  requestParamNotValid: vi.fn(
    (msg) => new Error(msg || "Request param not valid")
  ),
}));

vi.mock("../src/model/domain/apiConverter.js", async () => ({
  UserModelToApiTipoDatiSoggettiEnte: vi.fn(),
}));

vi.mock("../src/utilities/validation-helper.js", async () => ({
  validateFullRequest: vi.fn(() => []),
}));

const mockUser = {
  subjectId: "UTENTE_123",
  name: "Mario",
  surname: "Rossi",
  birthDate: birthDateStructure,
  address: {
    addressType: "Residenza",
    address: {
      municipality: { nameMunicipality: "Roma" },
    },
  },
  subject: {
    subjectId: "UTENTE_123",
    surname: "Rossi",
    name: "Mario",
    birthDate: birthDateStructure,
  },
} as unknown as UserModel;

const mockApiSubject = {
  id: "dati-utente-mock",
};

describe("ResidenceVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("findUser", () => {
    it("should return user data when found by subjectId", async () => {
      const request: RichiestaAR001 = {
        operationId: "op1",
        criteria: { subjectId: "UTENTE_123" },
      } as unknown as RichiestaAR001;

      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(mockUser);
      // Imposta il mock value per il converter
      mockApiConverter.mockReturnValue(mockApiSubject as any);

      const result = await controller.findUser(request);

      expect(userService.getUserBySubjectId).toHaveBeenCalledWith("UTENTE_123");
      expect(result.idOp).toBe("op1");
      // Assert semplificato: verifica che l'array di soggetti contenga un elemento (il mock)
      expect(result.subjects?.subject).toHaveLength(1);
    });

    it("should return user data when found by personal info", async () => {
      const request: RichiestaAR001 = {
        operationId: "op2",
        criteria: {
          name: "Mario",
          surname: "Rossi",
          birthDate: {
            eventDate: "1990-01-01",
            birthPlace: {
              municipality: { nameMunicipality: "Roma" },
              place: { codState: "IT" },
            },
          },
        },
      } as unknown as RichiestaAR001;

      vi.mocked(userService.getByPersonalInfo).mockResolvedValue([mockUser]);
      mockApiConverter.mockReturnValue(mockApiSubject as any);

      const result = await controller.findUser(request);

      expect(userService.getByPersonalInfo).toHaveBeenCalledWith(
        request.criteria
      );
      expect(result.subjects?.subject).toHaveLength(1);
    });
  });

  describe("findUserVerify", () => {
    const mockInternalRequest = {
      operationId: "op-verifica-1",
      criteria: { subjectId: "UTENTE_123" },
    };

    const mockFlatItalianObj = {
      NOME: "Mario",
      DATA_NASCITA: "1990-01-01",
    };

    it("should successfully verify a user's data and map keys", async () => {
      const request: RichiestaAR002 = {
        idOperazioneClient: "op-verifica-1",
        criteriRicerca: { codiceFiscale: "UTENTE_123" },
        datiRichiesta: {},
      } as unknown as RichiestaAR002;

      vi.mocked(translateKeys).mockReturnValueOnce(mockInternalRequest as any);
      vi.mocked(translateKeys).mockReturnValueOnce(mockFlatItalianObj as any);

      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(mockUser);

      const result = await controller.findUserVerify(request);

      expect(userService.getUserBySubjectId).toHaveBeenCalled();
      expect(
        result.listaSoggetti?.datiSoggetto[0].infoSoggettoEnte
      ).toHaveLength(2);
      expect(result.listaAnomalie).toEqual([]);
    });
  });

  describe("getRotatedSeed", () => {
    const eserviceId = "eservice-test";
    const expectedSeed = "new-rotated-seed-123";

    it("should successfully generate and return the rotated seed", async () => {
      vi.mocked(userService.generateSeed).mockResolvedValue(expectedSeed);

      const result = await controller.getRotatedSeed(eserviceId);

      expect(userService.generateSeed).toHaveBeenCalledWith(
        eserviceId,
        expect.any(Object)
      );
      expect(result).toBe(expectedSeed);
    });

    it("should log error and rethrow if generateSeed fails", async () => {
      const mockError = new Error("Seed generation failed");
      vi.mocked(userService.generateSeed).mockRejectedValue(mockError);

      await expect(controller.getRotatedSeed(eserviceId)).rejects.toThrow(
        mockError
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Controller Error during getRotatedSeed`,
        mockError
      );
    });
  });
});
