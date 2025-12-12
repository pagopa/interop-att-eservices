import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { userService, translateKeys } from "pdnd-common";
import { UserModel } from "pdnd-models";
import { userModelNotFound } from "../src/exceptions/errors.js"; // Updated import
import { UserModelToApiTipoDatiSoggettiEnte } from "../src/model/domain/apiConverter.js";
import { RichiestaAR001, RichiestaAR002 } from "../src/model/domain/models.js";
import controller from "../src/controllers/residenceVerificationController.js";

vi.mock("pdnd-common", async () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(),
  userService: {
    getUserBySubjectId: vi.fn(),
    getByPersonalInfo: vi.fn(),
  },
  translateKeys: vi.fn(),
}));

vi.mock("../src/utils/residence-mappings.js", async () => ({
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
  birthDate: {
    eventDate: "1990-01-01",
    birthPlace: {
      municipality: { nameMunicipality: "Roma" },
      place: { codState: "IT" },
    },
  },
  address: {
    addressType: "Residenza",
    address: {
      municipality: { nameMunicipality: "Roma" },
    },
  },
  subject: {
    name: "Mario",
    surname: "Rossi",
  },
} as unknown as UserModel;

describe("ResidenceVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("findUser", () => {
    it("should return user data when found by subjectId", async () => {
      const request = {
        operationId: "op1",
        criteria: { subjectId: "UTENTE_123" },
      } as unknown as RichiestaAR001;

      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(mockUser);
      vi.mocked(UserModelToApiTipoDatiSoggettiEnte).mockReturnValue({
        id: "dati-utente-mock",
      });

      const result = await controller.findUser(request);

      expect(userService.getUserBySubjectId).toHaveBeenCalledWith("UTENTE_123");
      expect(result.idOp).toBe("op1");
      expect(result.subjects?.subject).toEqual([{ id: "dati-utente-mock" }]);
    });

    it("should return user data when found by personal info", async () => {
      const request = {
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
      vi.mocked(UserModelToApiTipoDatiSoggettiEnte).mockReturnValue({
        id: "dati-utente-mock",
      });

      const result = await controller.findUser(request);

      expect(userService.getByPersonalInfo).toHaveBeenCalledWith(
        request.criteria
      );
      expect(result.subjects?.subject).toHaveLength(1);
    });

    it("should throw 'userModelNotFound' error if the search yields no results", async () => {
      const request = {
        operationId: "op3",
        criteria: { subjectId: "UTENTE_SCONOSCIUTO" },
      } as unknown as RichiestaAR001;

      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(null);

      await expect(controller.findUser(request)).rejects.toThrow(
        "Codice fiscale non trovato"
      );
      expect(userModelNotFound).toHaveBeenCalledWith(
        "Codice fiscale non trovato"
      );
    });
  });

  describe("findUserVerify", () => {
    it("should successfully verify a user's data", async () => {
      const request = {
        idOperazioneClient: "op-verifica-1",
        criteriRicerca: { codiceFiscale: "UTENTE_123" },
        datiRichiesta: {},
      } as unknown as RichiestaAR002;

      const internalRequestMock = {
        operationId: "op-verifica-1",
        criteria: { subjectId: "UTENTE_123" },
      };

      const flatUserMock = {
        NOME: "Mario",
        COGNOME: "Rossi",
        DATA_NASCITA: "1990-01-01",
      };

      vi.mocked(translateKeys)
        .mockReturnValueOnce(internalRequestMock)
        .mockReturnValueOnce(flatUserMock);

      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(mockUser);

      const result = await controller.findUserVerify(request);

      expect(userService.getUserBySubjectId).toHaveBeenCalled();
      expect(result.idOperazioneANPR).toBe("op-verifica-1");
      expect(result.listaSoggetti?.datiSoggetto).toHaveLength(1);
      expect(result.listaAnomalie).toEqual([]);
    });

    it("should throw 'userModelNotFound' if the user to verify is not found", async () => {
      const request = {
        idOperazioneClient: "op-verifica-2",
        criteriRicerca: { codiceFiscale: "UTENTE_SCONOSCIUTO" },
      } as unknown as RichiestaAR002;

      const internalRequestMock = {
        operationId: "op-verifica-2",
        criteria: { subjectId: "UTENTE_SCONOSCIUTO" },
      };

      vi.mocked(translateKeys).mockReturnValue(internalRequestMock);
      vi.mocked(userService.getUserBySubjectId).mockResolvedValue(null);

      await expect(controller.findUserVerify(request)).rejects.toThrow(
        "Utente non trovato"
      );
      expect(userModelNotFound).toHaveBeenCalled();
    });
  });
});
