import { describe, it, expect, vi, beforeEach } from "vitest";
import ResidenceVerificationController from "../../../src/controllers/residenceVerificationController";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../../../src/services/residenceVerificationService";
import coordinatesService from "../../../src/services/coordinateService";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../../../src/exceptions/errors";
import {
  RichiestaAR001,
  RispostaAR001,
} from "../../../src/model/domain/models";
import { UserModelToApiTipoDatiSoggettiEnte } from "../../../src/model/domain/apiConverter";

// Mock delle dipendenze
vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn().mockReturnValue({
    someKey: "someValue", // Mock del contesto
  }),
}));

vi.mock("../../../src/services/residenceVerificationService", () => ({
  getBySubjectId: vi.fn(),
  getByPersonalInfo: vi.fn(),
  getById: vi.fn(),
}));

vi.mock("../../../src/services/coordinateService", () => ({
  getCoordinates: vi.fn(),
}));

describe("ResidenceVerificationController", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resetta tutti i mock tra un test e l'altro
  });

  describe("findUser", () => {
    it("should return user data by subjectId", async () => {
      const mockRequest: RichiestaAR001 = {
        operationId: "op123",
        criteria: { subjectId: "sub123" },
      };
      const mockUser = {
        address: {
          address: {
            toponym: { toponymDenomination: "Street" },
            civicNumber: { civicNumber: "123" },
            municipality: {
              nameMunicipality: "City",
              acronymIstatProvince: "PR",
              cap: "12345",
            },
          },
        },
      };
      const mockCoordinates = { lat: 45.0, lon: 9.0 };

      (
        ResidenceVerificationService.getBySubjectId as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockUser);
      (
        coordinatesService.getCoordinates as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCoordinates);

      const result = await ResidenceVerificationController.findUser(
        mockRequest
      );

      expect(ResidenceVerificationService.getBySubjectId).toHaveBeenCalledWith(
        "sub123"
      );
      expect(coordinatesService.getCoordinates).toHaveBeenCalledWith(
        "Street 123, City, PR, 12345"
      );
      expect(result).toEqual({
        idOp: "op123",
        subjects: {
          subject: [
            UserModelToApiTipoDatiSoggettiEnte({
              ...mockUser,
              address: {
                address: {
                  ...mockUser.address.address,
                  coords: mockCoordinates,
                },
              },
            }),
          ],
        },
      });
    });

    it("should log and throw an error if getBySubjectId fails", async () => {
      const mockRequest: RichiestaAR001 = {
        operationId: "op123",
        criteria: { subjectId: "sub123" },
      };
      const mockError = new Error("Test error");

      (
        ResidenceVerificationService.getBySubjectId as ReturnType<typeof vi.fn>
      ).mockRejectedValue(mockError);

      await expect(
        ResidenceVerificationController.findUser(mockRequest)
      ).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "Error during in method controller 'findUser': ",
        mockError
      );
    });

    it("should throw requestParamNotValid error if criteria is invalid", async () => {
      const mockRequest: RichiestaAR001 = {
        operationId: "op123",
        criteria: {},
      };

      await expect(
        ResidenceVerificationController.findUser(mockRequest)
      ).rejects.toThrow(requestParamNotValid);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("findUserVerify", () => {
    it("should return verified user data", async () => {
      const mockRequest = {
        operationId: "op123",
        criteria: { subjectId: "sub123" },
      };
      const mockUser = {
        address: {
          address: {
            toponym: { toponymDenomination: "Street" },
            civicNumber: { civicNumber: "123" },
            municipality: {
              nameMunicipality: "City",
              acronymIstatProvince: "PR",
              cap: "12345",
            },
          },
        },
      };
      const mockCoordinates = { lat: 45.0, lon: 9.0 };

      (
        ResidenceVerificationService.getBySubjectId as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockUser);
      (
        coordinatesService.getCoordinates as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCoordinates);

      const result = await ResidenceVerificationController.findUserVerify(
        mockRequest
      );

      expect(ResidenceVerificationService.getBySubjectId).toHaveBeenCalledWith(
        "sub123"
      );
      expect(coordinatesService.getCoordinates).toHaveBeenCalledWith(
        "Street 123, City, PR, 12345"
      );
      expect(result).toEqual({
        idOp: "op123",
        subjects: {
          subject: [
            UserModelToApiTipoDatiSoggettiEnte({
              ...mockUser,
              address: {
                address: {
                  ...mockUser.address.address,
                  coords: mockCoordinates,
                },
              },
            }),
          ],
        },
      });
    });

    it("should log and throw error if ResidenceVerificationService fails", async () => {
      const mockRequest = {
        operationId: "op123",
        criteria: { subjectId: "sub123" },
      };
      const mockError = new Error("Test error");

      (
        ResidenceVerificationService.getBySubjectId as ReturnType<typeof vi.fn>
      ).mockRejectedValue(mockError);

      await expect(
        ResidenceVerificationController.findUserVerify(mockRequest)
      ).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        "Error during in method controller 'findUserVerify': ",
        mockError
      );
    });
  });
});
