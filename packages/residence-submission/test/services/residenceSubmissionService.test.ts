import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "pdnd-common";
import ResidenceVerificationService from "../../src/services/residenceSubmissionService.js";
import dataPreparationRepository from "../../src/repository/dataPreparationRepository.js";
import { UserModel } from "pdnd-models";
import {
  findUserModelBySubjectId,
  findUserModelById,
  findUserModelByPersonalInfo,
} from "../../src/utilities/userUtilities.js";
import { userModelNotFound } from "../../src/exceptions/errors.js";

// Mock delle dipendenze
vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(() => ({
    authData: {
      purposeId: "testPurposeId",
    },
  })),
}));

vi.mock("../../src/repository/dataPreparationRepository.js", () => ({
  findAllByKey: vi.fn(),
}));

vi.mock("../../src/utilities/userUtilities.js", () => ({
  findUserModelBySubjectId: vi.fn(),
  findUserModelById: vi.fn(),
  findUserModelByPersonalInfo: vi.fn(),
}));

describe("ResidenceVerificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBySubjectId", () => {
    it("should return the user model when found by subjectId", async () => {
      const mockUser: UserModel = { id: "123", subjectId: "testSubjectId" };
      dataPreparationRepository.findAllByKey.mockResolvedValue([mockUser]);
      findUserModelBySubjectId.mockReturnValue(mockUser);

      const result = await ResidenceVerificationService.getBySubjectId("testSubjectId");

      expect(result).toEqual(mockUser);
      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalled();
      expect(findUserModelBySubjectId).toHaveBeenCalledWith([mockUser], "testSubjectId");
    });

    it("should log an error and throw it if an error occurs", async () => {
      const mockError = new Error("Test error");
      dataPreparationRepository.findAllByKey.mockRejectedValue(mockError);

      await expect(ResidenceVerificationService.getBySubjectId("testSubjectId")).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        `UserService: Errore durante il salvataggio della lista. `,
        mockError
      );
    });
  });

  describe("getById", () => {
    it("should return the user model when found by id", async () => {
      const mockUser: UserModel = { id: "123", subjectId: "testSubjectId" };
      dataPreparationRepository.findAllByKey.mockResolvedValue([mockUser]);
      findUserModelById.mockReturnValue(mockUser);

      const result = await ResidenceVerificationService.getById("123");

      expect(result).toEqual(mockUser);
      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalled();
      expect(findUserModelById).toHaveBeenCalledWith([mockUser], "123");
    });

    it("should log an error and throw it if an error occurs", async () => {
      const mockError = new Error("Test error");
      dataPreparationRepository.findAllByKey.mockRejectedValue(mockError);

      await expect(ResidenceVerificationService.getById("123")).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        `UserService: Errore durante il salvataggio della lista. `,
        mockError
      );
    });
  });

  describe("getByPersonalInfo", () => {
    it("should return the user models when found by personal info", async () => {
      const mockUsers: UserModel[] = [{ id: "123", subjectId: "testSubjectId" }];
      const mockParametriRicerca = { name: "testName" };
      dataPreparationRepository.findAllByKey.mockResolvedValue(mockUsers);
      findUserModelByPersonalInfo.mockReturnValue(mockUsers);

      const result = await ResidenceVerificationService.getByPersonalInfo(mockParametriRicerca);

      expect(result).toEqual(mockUsers);
      expect(dataPreparationRepository.findAllByKey).toHaveBeenCalled();
      expect(findUserModelByPersonalInfo).toHaveBeenCalledWith(mockUsers, mockParametriRicerca);
    });

    it("should throw userModelNotFound if no user is found", async () => {
      const mockParametriRicerca = { name: "testName" };
      dataPreparationRepository.findAllByKey.mockResolvedValue([]);
      findUserModelByPersonalInfo.mockReturnValue(null);

      await expect(ResidenceVerificationService.getByPersonalInfo(mockParametriRicerca)).rejects.toThrow(userModelNotFound("Not found"));
    });

    it("should log an error and throw it if an error occurs", async () => {
      const mockError = new Error("Test error");
      const mockParametriRicerca = { name: "testName" };
      dataPreparationRepository.findAllByKey.mockRejectedValue(mockError);

      await expect(ResidenceVerificationService.getByPersonalInfo(mockParametriRicerca)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        `UserService: Errore durante il salvataggio della lista. `,
        mockError
      );
    });
  });
});