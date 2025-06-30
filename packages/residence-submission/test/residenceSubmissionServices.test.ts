/* eslint-disable curly */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { eq } from "drizzle-orm";

// Mock delle dipendenze usate nel servizio
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

import residenceSubmissionService from "../src/services/residenceSubmissionService.js";
import { RichiestaAR003 } from "../src/model/domain/models.js";
import { setupTestDb } from "./setUpTestDb.js";

let mockedDbInstance: any;
let Subject: any;
let Usecase: any;
let Address: any;

describe("residenceSubmissionService Integration", () => {
  let client: any;
  let container: any;

  beforeAll(async () => {
    // Avvia container e db
    const setup = await setupTestDb();
    client = setup.client;
    mockedDbInstance = setup.db;
    container = setup.container;

    // Importa modelli DB dopo che il DB è pronto
    const sub = await import("../src/model/db/subjects.model.js");
    const usc = await import("../src/model/db/usecases.model.js");
    const addr = await import("../src/model/db/addresses.model.js");
    Subject = sub;
    Usecase = usc;
    Address = addr;
  }, 60000);

  afterAll(async () => {
    if (client) await client.end();
    if (container) await container.stop();
  });

  beforeEach(async () => {
    // Pulisce i dati prima di ogni test
    await mockedDbInstance.delete(Usecase);
    await mockedDbInstance.delete(Address);
    await mockedDbInstance.delete(Subject);
  });

  it("should create successfully with no usecases", async () => {
    await mockedDbInstance.insert(Subject).values({
      subject_id: "subjectId",
      uuid: "uuid-s1",
    });

    await expect(
      residenceSubmissionService.create({
        subject_id: "subjectId",
      } as RichiestaAR003),
    ).resolves.toBeUndefined();
  });

  it("should not create if subject is not found", async () => {
    await expect(
      residenceSubmissionService.create({
        subject_id: "subjectId",
      } as RichiestaAR003),
    ).rejects.toThrow("Subject not found");
  });

  it("should update successfully", async () => {
    await mockedDbInstance.insert(Subject).values({
      subject_id: "s1",
      uuid: "uuid-s1",
    });

    await mockedDbInstance.insert(Address).values({
      id: "a1",
    });

    await mockedDbInstance.insert(Usecase).values({
      id: "u1",
      subject_id: "s1",
      address_id: "a1",
      purpose_id: "p1",
    });

    await expect(
      residenceSubmissionService.updateByUsecasesIdService({
        subjects: {
          subject: [{ generality: { subjectId: { subjectId: "s1" } } }],
        },
      }),
    ).resolves.toBeUndefined();

    const updatedSubject = await mockedDbInstance
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, "s1"));

    const updatedAddress = await mockedDbInstance
      .select()
      .from(Address)
      .where(eq(Address.id, "a1"));

    expect(updatedSubject.length).toBe(1);
    expect(updatedAddress.length).toBe(1);
  });

  it("should not update if subject not found", async () => {
    await expect(
      residenceSubmissionService.updateByUsecasesIdService({
        subjects: {
          subject: [{ generality: { subjectId: { subjectId: "s1" } } }],
        },
      }),
    ).rejects.toThrow("Subject not found");
  });

  it("should update even if no usecases found", async () => {
    await mockedDbInstance.insert(Subject).values({
      subject_id: "s1",
      uuid: "uuid-s1",
    });

    await expect(
      residenceSubmissionService.updateByUsecasesIdService({
        subjects: {
          subject: [{ generality: { subjectId: { subjectId: "s1" } } }],
        },
      }),
    ).resolves.toBeUndefined();

    const updatedSubject = await mockedDbInstance
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, "s1"));

    expect(updatedSubject.length).toBe(1);
  });
});
