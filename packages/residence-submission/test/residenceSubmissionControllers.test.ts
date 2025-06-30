import { describe, it, expect, vi, beforeEach } from "vitest";
import ResidenceSubmissionController from "../src/controllers/residenceSubmissionController.js";
import residenceSubmissionService from "../src/services/residenceSubmissionService.js";
import { RichiestaAR003 } from "../src/model/domain/models.js";

describe("ResidenceSubmissionController", () => {
  const mockRequest = { subject_id: "subjectId" } as RichiestaAR003;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createUser", () => {
    it("should return OK on success", async () => {
      vi.spyOn(residenceSubmissionService, "create").mockResolvedValue();

      const result = await ResidenceSubmissionController.createUser(
        mockRequest,
      );

      expect(result).toEqual({
        status: "OK",
        message: "User created successfully",
      });
    });

    it("should return KO on error", async () => {
      vi.spyOn(residenceSubmissionService, "create").mockRejectedValue(
        new Error("Error")
      );

      const result = await ResidenceSubmissionController.createUser(
        mockRequest
      );

      expect(result).toEqual({
        status: "KO",
        message: expect.stringMatching(/list saving/i),
      });
    });
  });

  describe("updateUser", () => {
    it("should return OK on success", async () => {
      vi.spyOn(
        residenceSubmissionService,
        "updateByUsecasesIdService"
      ).mockResolvedValue();

      const result = await ResidenceSubmissionController.updateUser(
        mockRequest
      );

      expect(result).toEqual({
        status: "OK",
        message: "User updated successfully",
      });
    });

    it("should return KO on error", async () => {
      vi.spyOn(
        residenceSubmissionService,
        "updateByUsecasesIdService",
      ).mockRejectedValue(new Error("Error"));

      const result = await ResidenceSubmissionController.updateUser(
        mockRequest
      );

      expect(result).toEqual({
        status: "KO",
        message: expect.stringMatching(/user update/i),
      });
    });
  });

  describe("deleteUser", () => {
    it("should return OK on success", async () => {
      vi.spyOn(residenceSubmissionService, "delete").mockResolvedValue();

      const result = await ResidenceSubmissionController.deleteUser("user-id");

      expect(result).toEqual({
        status: "OK",
        message: "User deleted successfully",
      });
    });

    it("should return KO on error", async () => {
      vi.spyOn(residenceSubmissionService, "delete").mockRejectedValue(
        new Error("Error")
      );

      const result = await ResidenceSubmissionController.deleteUser("user-id");

      expect(result).toEqual({
        status: "KO",
        message: expect.stringMatching(/user deletion/i),
      });
    });
  });
});
