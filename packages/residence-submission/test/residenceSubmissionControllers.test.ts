import { expect, it, vi } from "vitest";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
    readFileSync: vi.fn(() => "MOCK_PRIVATE_KEY_CONTENT"),
    default: {
      ...actual,
      readFileSync: vi.fn(() => "MOCK_PRIVATE_KEY_CONTENT"),
    },
  };
});

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
