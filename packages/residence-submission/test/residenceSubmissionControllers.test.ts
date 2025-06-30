/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResidenceSubmissionController from "../src/controllers/residenceSubmissionController";
import residenceSubmissionService from "../src/services/residenceSubmissionService";

vi.mock("pdnd-common", () => ({
  getContext: vi.fn(() => ({ mockApp: true })),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("../src/services/residenceSubmissionService", () => ({
  default: {
    create: vi.fn(),
    updateByUsecasesIdService: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ResidenceSubmissionController", () => {
  const mockRequest = {
    subjects: {
      subject: [
        {
          generality: {
            subjectId: { subjectId: "test-id" },
          },
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should return OK on success", async () => {
      (residenceSubmissionService.create as any).mockResolvedValue();

      const result = await ResidenceSubmissionController.createUser(
        mockRequest as any,
      );

      expect(result).toEqual({
        status: "OK",
        message: "User created successfully",
      });
    });

    it("should return KO on error", async () => {
      (residenceSubmissionService.create as any).mockRejectedValue(
        new Error("boom"),
      );

      const result = await ResidenceSubmissionController.createUser(
        mockRequest as any,
      );

      expect(result.status).toBe("KO");
      expect(result.message).toMatch(/list saving/i);
    });
  });

  describe("updateUser", () => {
    it("should return OK on success", async () => {
      (
        residenceSubmissionService.updateByUsecasesIdService as any
      ).mockResolvedValue();

      const result = await ResidenceSubmissionController.updateUser(
        mockRequest as any,
      );

      expect(result).toEqual({
        status: "OK",
        message: "User updated successfully",
      });
    });

    it("should return KO on error", async () => {
      (
        residenceSubmissionService.updateByUsecasesIdService as any
      ).mockRejectedValue(new Error("update fail"));

      const result = await ResidenceSubmissionController.updateUser(
        mockRequest as any,
      );

      expect(result.status).toBe("KO");
      expect(result.message).toMatch(/user update/i);
    });
  });

  describe("deleteUser", () => {
    it("should return OK on success", async () => {
      (residenceSubmissionService.delete as any).mockResolvedValue();

      const result = await ResidenceSubmissionController.deleteUser("id1");

      expect(result).toEqual({
        status: "OK",
        message: "User deleted successfully",
      });
    });

    it("should return KO on error", async () => {
      (residenceSubmissionService.delete as any).mockRejectedValue(
        new Error("delete fail"),
      );

      const result = await ResidenceSubmissionController.deleteUser("id1");

      expect(result.status).toBe("KO");
      expect(result.message).toMatch(/user deletion/i);
    });
  });
});
