import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";

import { userService } from "pdnd-common";
import { userModelNotFound } from "../src/exceptions/errors.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../src/model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../src/utilities/equalsUtilities.js";

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
}));

vi.mock("../src/exceptions/errors.js", async () => ({
  userModelNotFound: vi.fn((msg) => new Error(msg || "Utente non trovato")),
}));

vi.mock("../src/model/domain/apiConverter.js", async () => ({
  UserModelToApiTipoDatiSoggettiEnte: vi.fn(),
}));

vi.mock("../src/utilities/equalsUtilities.js", async () => ({
  checkInfoSoggettoEquals: vi.fn(),
}));

import controller from "../src/controllers/residenceVerificationController.js";

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
      const request = {
        operationId: "op1",
        criteria: { subjectId: "UTENTE_123" },
      };
      (userService.getUserBySubjectId as Mock).mockResolvedValue(mockUser);
      (UserModelToApiTipoDatiSoggettiEnte as Mock).mockReturnValue({
        id: "dati-utente-mock",
      });

      const result = await controller.findUser(request);

      expect(userService.getUserBySubjectId).toHaveBeenCalledWith("UTENTE_123");
      expect(result.idOp).toBe("op1");
      expect(result.subjects.subject).toEqual([{ id: "dati-utente-mock" }]);
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
      };
      (userService.getByPersonalInfo as Mock).mockResolvedValue([mockUser]);
      (UserModelToApiTipoDatiSoggettiEnte as Mock).mockReturnValue({
        id: "dati-utente-mock",
      });

      const result = await controller.findUser(request);

      expect(userService.getByPersonalInfo).toHaveBeenCalledWith(
        request.criteria
      );
      expect(result.subjects.subject).toHaveLength(1);
    });

    it("should throw 'userModelNotFound' error if the search yields no results", async () => {
      const request = {
        operationId: "op3",
        criteria: { subjectId: "UTENTE_SCONOSCIUTO" },
      };
      (userService.getUserBySubjectId as Mock).mockResolvedValue(null);

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
        operationId: "op-verifica-1",
        criteria: { subjectId: "UTENTE_123" },
        check: {
          address: {},
        },
      };
      const checkResult = { esito: "OK" };
      (userService.getUserBySubjectId as Mock).mockResolvedValue(mockUser);
      (checkInfoSoggettoEquals as Mock).mockReturnValue(checkResult);

      const result = await controller.findUserVerify(request);

      expect(checkInfoSoggettoEquals).toHaveBeenCalledWith(
        request.check?.address,
        mockUser
      );
      expect(result.idOp).toBe("op-verifica-1");
      expect(result.subjects.infoSubject[0]).toEqual(checkResult);
    });

    it("should throw 'userModelNotFound' if the user to verify is not found", async () => {
      const request = {
        operationId: "op-verifica-2",
        criteria: { subjectId: "UTENTE_SCONOSCIUTO" },
        check: { address: {} },
      };
      (userService.getUserBySubjectId as Mock).mockResolvedValue(null);

      await expect(controller.findUserVerify(request)).rejects.toThrow(
        "Utente non trovato"
      );
      expect(userModelNotFound).toHaveBeenCalled();
    });
  });
});
