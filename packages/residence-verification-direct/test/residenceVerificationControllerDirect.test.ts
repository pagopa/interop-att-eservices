import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";

import { logger, userServiceDirect, CoordinatesService } from "pdnd-common";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../src/exceptions/errors.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../src/model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../src/utilities/equalsUtilities.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(),
  userServiceDirect: {
    getUserBySubjectId: vi.fn(),
    getByPersonalInfo: vi.fn(),
  },
  CoordinatesService: {
    getCoordinates: vi.fn(),
  },
}));

vi.mock("../src/exceptions/errors.js", () => ({
  requestParamNotValid: vi.fn(() => new Error("Request param not valid")),
  userModelNotFound: vi.fn(() => new Error("User model not found")),
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  UserModelToApiTipoDatiSoggettiEnte: vi.fn(),
}));

vi.mock("../src/utilities/equalsUtilities.js", () => ({
  checkInfoSoggettoEquals: vi.fn(),
}));

import controller from "../src/controllers/residenceVerificationController.js";

const mockUser = {
  subjectId: "USER_123",
  name: "Mario",
  surname: "Rossi",
  address: {
    address: {
      toponym: { toponymDenomination: "Via" },
      civicNumber: { civicNumber: "10" },
      municipality: {
        nameMunicipality: "Roma",
        acronymIstatProvince: "RM",
      },
      cap: "00100",
    },
  },
  birthDate: {
    eventDate: "1990-01-01",
    birthPlace: {
      municipality: { nameMunicipality: "Roma" },
      place: { codState: "IT" },
    },
  },
};

const mockCoordinates = { latitude: 41.9027835, longitude: 12.4963655 };

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
        criteria: { subjectId: "USER_123" },
      };
      (userServiceDirect.getUserBySubjectId as Mock).mockResolvedValue(
        mockUser
      );
      (CoordinatesService.getCoordinates as Mock).mockResolvedValue(
        mockCoordinates
      );
      (UserModelToApiTipoDatiSoggettiEnte as Mock).mockReturnValue({
        subjectId: "USER_123",
      });

      const result = await controller.findUser(request);

      expect(userServiceDirect.getUserBySubjectId).toHaveBeenCalledWith(
        "USER_123"
      );
      expect(CoordinatesService.getCoordinates).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result?.idOp).toBe("op1");
      expect(result?.subjects.subject).toHaveLength(1);
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
      (userServiceDirect.getByPersonalInfo as Mock).mockResolvedValue([
        mockUser,
      ]);
      (CoordinatesService.getCoordinates as Mock).mockResolvedValue(
        mockCoordinates
      );
      (UserModelToApiTipoDatiSoggettiEnte as Mock).mockReturnValue({
        subjectId: "USER_123",
      });

      const result = await controller.findUser(request);

      expect(userServiceDirect.getByPersonalInfo).toHaveBeenCalledWith(
        request.criteria
      );
      expect(result?.subjects.subject).toHaveLength(1);
    });

    it('should throw a "requestParamNotValid" error if the user is not found', async () => {
      const request = {
        operationId: "op3",
        criteria: { subjectId: "USER_UNKNOWN" },
      };
      (userServiceDirect.getUserBySubjectId as Mock).mockResolvedValue(null);

      await expect(controller.findUser(request)).rejects.toThrow(
        "Request param not valid"
      );
      expect(requestParamNotValid).toHaveBeenCalledWith(
        "The request body has one or more required param not valid"
      );
    });

    it("should throw an error and log it if the service fails", async () => {
      const request = {
        operationId: "op4",
        criteria: { subjectId: "USER_123" },
      };
      const serviceError = new Error("Service unavailable");
      (userServiceDirect.getUserBySubjectId as Mock).mockRejectedValue(
        serviceError
      );
      await expect(controller.findUser(request)).rejects.toThrow(serviceError);
      expect(logger.error).toHaveBeenCalledWith(
        "Error in 'findUser': ",
        serviceError
      );
    });
  });

  describe("findUserVerify", () => {
    it("should successfully verify a user's address", async () => {
      const request = {
        operationId: "op-verify-1",
        criteria: { subjectId: "USER_123" },
        check: {
          address: {},
        },
      };
      const checkResult = { esito: "OK" };
      (userServiceDirect.getUserBySubjectId as Mock).mockResolvedValue(
        mockUser
      );
      (CoordinatesService.getCoordinates as Mock).mockResolvedValue(
        mockCoordinates
      );
      (checkInfoSoggettoEquals as Mock).mockReturnValue(checkResult);

      const result = await controller.findUserVerify(request);

      expect(checkInfoSoggettoEquals).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.idOp).toBe("op-verify-1");
      expect(result.subjects.infoSubject[0]).toEqual(checkResult);
    });

    it('should throw "userModelNotFound" if the user is not found', async () => {
      const request = {
        operationId: "op-verify-2",
        criteria: { subjectId: "USER_UNKNOWN" },
      };
      (userServiceDirect.getUserBySubjectId as Mock).mockResolvedValue(null);

      await expect(controller.findUserVerify(request)).rejects.toThrow(
        "User model not found"
      );
      expect(userModelNotFound).toHaveBeenCalled();
    });

    it("should throw an error and log it if the service fails during verification", async () => {
      const request = {
        operationId: "op-verify-3",
        criteria: { subjectId: "USER_123" },
      };
      const serviceError = new Error("DB connection failed");
      (userServiceDirect.getUserBySubjectId as Mock).mockRejectedValue(
        serviceError
      );
      await expect(controller.findUserVerify(request)).rejects.toThrow(
        serviceError
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error in 'findUserVerify': ",
        serviceError
      );
    });
  });
});
