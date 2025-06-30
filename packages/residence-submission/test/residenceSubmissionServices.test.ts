/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/no-let */
import {
  describe,
  it,
  expect,
  beforeAll,
  vi,
  beforeEach,
} from "vitest";
import ResidenceSubmissionService from "../src/services/residenceSubmissionService.js";
import { setupTestDb } from "./setUpTestDb.js";

vi.mock("pdnd-common", () => ({
  getContext: vi.fn(),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("../src/exceptions/errors.js", () => ({
  userModelNotFound: vi.fn((msg) => new Error(msg ?? "User not found")),
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  mapApiBodyToDbModels: vi.fn(() => ({
    subject: { subject_id: "s1" },
    purpose: { id: "p1" },
    addresses: [{ id: "a1" }],
    usecases: [{ id: "u1" }],
  })),
  mapApiBodyToDbModelsUpdate: vi.fn(() => ({
    subject: { subject_id: "s1" },
    address: { id: "a1" },
  })),
}));

vi.mock("../src/repository/dataPreparationRepository.js", () => ({
  default: {
    findSubjectById: vi.fn(),
    findUsecasesById: vi.fn(),
    updateSubjectById: vi.fn(),
    updateAddressById: vi.fn(),
    createSubject: vi.fn(),
    createPurpose: vi.fn(),
    createAddress: vi.fn(),
    createUsecase: vi.fn(),
    deleteUsecaseById: vi.fn(),
    deleteSubjectById: vi.fn(),
    deleteAddressById: vi.fn(),
    deletePurposeById: vi.fn(),
  },
}));

describe("ResidenceSubmissionService", () => {
  let db: any;

  beforeAll(async () => {
    const setup = await setupTestDb();
    db = setup.db;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getBySubjectId returns null when no usecases", async () => {
    const repo = (
      await import("../src/repository/dataPreparationRepository.js")
    ).default;
    repo.findSubjectById.mockResolvedValue({ uuid: "uuid-s1" });
    repo.findUsecasesById.mockResolvedValue([]);

    const result = await ResidenceSubmissionService.getBySubjectId("s1");
    expect(result).toBeNull();
  });

  it("create throws if subject exists", async () => {
    const repo = (
      await import("../src/repository/dataPreparationRepository.js")
    ).default;
    repo.findSubjectById.mockResolvedValue({});

    await expect(
      ResidenceSubmissionService.create({
        subjects: {
          subject: [{ generality: { subjectId: { subjectId: "s1" } } }],
        },
      } as any),
    ).rejects.toThrow("already exists");
  });

  it("updateByUsecasesIdService processes updates", async () => {
    const repo = (
      await import("../src/repository/dataPreparationRepository.js")
    ).default;
    repo.findSubjectById.mockResolvedValue({ uuid: "uuid-s1" });
    repo.findUsecasesById.mockResolvedValue([
      { subject_id: "s1", address_id: "a1" },
    ]);

    await ResidenceSubmissionService.updateByUsecasesIdService({
      subjects: {
        subject: [{ generality: { subjectId: { subjectId: "s1" } } }],
      },
    });

    expect(repo.updateSubjectById).toHaveBeenCalled();
    expect(repo.updateAddressById).toHaveBeenCalled();
  });

  it("delete deletes all entities", async () => {
    const repo = (
      await import("../src/repository/dataPreparationRepository.js")
    ).default;
    repo.findSubjectById.mockResolvedValue({ uuid: "uuid-s1" });
    repo.findUsecasesById.mockResolvedValue([
      { id: "u1", address_id: "a1", purpose_id: "p1" },
    ]);

    await ResidenceSubmissionService.delete("s1");

    expect(repo.deleteUsecaseById).toHaveBeenCalledWith("u1");
    expect(repo.deleteSubjectById).toHaveBeenCalledWith("s1");
    expect(repo.deleteAddressById).toHaveBeenCalledWith("a1");
    expect(repo.deletePurposeById).toHaveBeenCalledWith("p1");
  });
});
