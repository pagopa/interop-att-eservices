import { it, expect, vi } from "vitest";
import ResidenceSubmissionController from "../src/controllers/residenceSubmissionController.js";
import { RichiestaAR003 } from "../src/model/domain/models.js";
vi.mock("../src/services/residenceSubmissionService.js", () => ({
  default: {
    create: vi.fn(),
    updateByUsecasesIdService: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockRequest = { subject_id: "subjectId" } as RichiestaAR003;
it("should return OK on successful user creation", async () => {
  const result = await ResidenceSubmissionController.createUser(mockRequest);
  expect(result).toEqual({
    status: "OK",
    message: "User created successfully",
  });
});
it("should return KO on user creation error", async () => {
  const result = await ResidenceSubmissionController.createUser(mockRequest);
  expect(result).toEqual({
    status: "KO",
    message: expect.stringMatching(/list saving/i),
  });
});
it("should return OK on successful user update", async () => {
  const result = await ResidenceSubmissionController.updateUser(mockRequest);
  expect(result).toEqual({
    status: "OK",
    message: "User updated successfully",
  });
});
it("should return KO on user update error", async () => {
  const result = await ResidenceSubmissionController.updateUser(mockRequest);
  expect(result).toEqual({
    status: "KO",
    message: expect.stringMatching(/user update/i),
  });
});
it("should return OK on successful user deletion", async () => {
  const result = await ResidenceSubmissionController.deleteUser("user-id");
  expect(result).toEqual({
    status: "OK",
    message: "User deleted successfully",
  });
});
it("should return KO on user deletion error", async () => {
  const result = await ResidenceSubmissionController.deleteUser("user-id");
  expect(result).toEqual({
    status: "KO",
    message: expect.stringMatching(/user deletion/i),
  });
});
