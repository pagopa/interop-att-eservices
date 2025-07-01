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
import { v4 as uuidv4 } from "uuid";

vi.mock("./repositories/dataPreparationRepository");

vi.mock("pdnd-common", () => ({
  getContext: vi.fn(),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
  InteroperabilityConfig: {
    and: vi.fn(() => ({
      parse: vi.fn(() => ({
        databaseUrl: "postgresql://user:password@localhost:5432/testdb",
        DB_USER: "test",
        DB_HOST: "localhost",
        DB_NAME: "testdb",
        DB_PASSWORD: "test",
        DB_PORT: "5432",
      })),
    })),
  },
  DatabaseConfig: {
    and: vi.fn(() => ({
      parse: vi.fn(() => ({
        databaseUrl: "postgresql://user:password@localhost:5432/testdb",
      })),
    })),
  },
}));

vi.mock("../src/exceptions/errors.js", () => ({
  userModelNotFound: vi.fn((msg) =>
    Object.assign(new Error(msg ?? "User not found"), {
      name: "userModelNotFound",
    })
  ),
}));

let latestPurposeId: string;
let latestAddressId: string;
let latestSubjectId: string;
let latestUsecaseId: string;
let latestSubjectUuid: string;

vi.mock("../src/model/domain/apiConverter.js", () => ({
  mapApiBodyToDbModels: vi.fn((input) => {
    latestPurposeId = uuidv4();
    latestAddressId = uuidv4();
    latestSubjectId =
      input?.subjects?.subject?.[0]?.generality?.subjectId?.subjectId ?? "s1";
    latestUsecaseId = uuidv4();
    latestSubjectUuid = uuidv4();

    return {
      subject: { subject_id: latestSubjectId, uuid: latestSubjectUuid },
      purpose: { id: latestPurposeId },
      addresses: [{ id: latestAddressId }],
      usecases: [
        {
          id: latestUsecaseId,
          purpose_id: latestPurposeId,
          subject_id: latestSubjectUuid,
          address_id: latestAddressId,
        },
      ],
    };
  }),
  mapApiBodyToDbModelsUpdate: vi.fn((subjectId, addressId) => ({
    subject: { subject_id: subjectId, uuid: uuidv4() },
    address: { id: addressId },
  })),
}));

import residenceSubmissionService from "../src/services/residenceSubmissionService.js";
import { Subject as SubjectTable } from "../src/model/db/subjects.model.js";
import { Address as AddressTable } from "../src/model/db/addresses.model.js";
import { Usecase as UsecaseTable } from "../src/model/db/usecases.model.js";
import { Purpose as PurposeTable } from "../src/model/db/purposes.model.js";
import * as apiConverter from "../src/model/domain/apiConverter.js";
import { setupTestDb } from "./setUpTestDb.js";

let mockedDbInstance: any;
let Subject: any;
let Usecase: any;
let Address: any;
let Purpose: any;
let client: any;

describe("residenceSubmissionService Integration", () => {
  let container: any;

  beforeAll(async () => {
    const setup = await setupTestDb();
    client = setup.client;
    mockedDbInstance = setup.db;
    container = setup.container;

    Subject = SubjectTable;
    Usecase = UsecaseTable;
    Address = AddressTable;
    Purpose = PurposeTable;
  }, 60000);

  afterAll(async () => {
    if (client) await client.end();
    if (container) await container.stop();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await mockedDbInstance.delete(Usecase);
    await mockedDbInstance.delete(Purpose);
    await mockedDbInstance.delete(Address);
    await mockedDbInstance.delete(Subject);
  });

  it("should update successfully", async () => {
    const subjectIdToTest = "s1";
    const testSubjectUuid = uuidv4();
    const testAddressId = uuidv4();
    const testUsecaseId = uuidv4();
    const testPurposeId = uuidv4();

    await mockedDbInstance.insert(Subject).values({
      subject_id: subjectIdToTest,
      uuid: testSubjectUuid,
      id: uuidv4(),
      surname: "Old",
      name: "Subject",
      gender: "M",
      birth_event_date: null,
      birth_exceptional_place: null,
      birth_province_county: null,
      birth_municipality_name: null,
      birth_municipality_istat_code: null,
      birth_municipality_acronym_istat_province: null,
      birth_municipality_place_description: null,
      birth_place_description: null,
      birth_country_description: null,
      birth_cod_state: null,
    });
    await mockedDbInstance.insert(Address).values({ id: testAddressId });
    await mockedDbInstance.insert(Purpose).values({ id: testPurposeId });

    await mockedDbInstance.insert(Usecase).values({
      id: testUsecaseId,
      subject_id: testSubjectUuid,
      address_id: testAddressId,
      purpose_id: testPurposeId,
    });

    vi.mocked(apiConverter.mapApiBodyToDbModelsUpdate).mockReturnValueOnce({
      subject: { subject_id: subjectIdToTest, uuid: testSubjectUuid },
      address: { id: testAddressId },
    });

    await expect(
      residenceSubmissionService.updateByUsecasesIdService({
        subjects: {
          subject: [
            { generality: { subjectId: { subjectId: subjectIdToTest } } },
          ],
        },
      })
    ).resolves.toBeUndefined();

    const updatedSubject = await mockedDbInstance
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, subjectIdToTest));

    const updatedAddress = await mockedDbInstance
      .select()
      .from(Address)
      .where(eq(Address.id, testAddressId));

    expect(updatedSubject.length).toBe(1);
    expect(updatedAddress.length).toBe(1);
  });


  it("should update subject with no usecases successfully", async () => {
    const subjectIdToTest = "s1";
    const testSubjectUuid = uuidv4();

    await mockedDbInstance.insert(Subject).values({
      subject_id: subjectIdToTest,
      uuid: testSubjectUuid,
      id: uuidv4(),
      surname: "SubjectWithNoUsecases",
      name: "User",
      gender: "M",
      birth_event_date: null,
      birth_exceptional_place: null,
      birth_province_county: null,
      birth_municipality_name: null,
      birth_municipality_istat_code: null,
      birth_municipality_acronym_istat_province: null,
      birth_municipality_place_description: null,
      birth_place_description: null,
      birth_country_description: null,
      birth_cod_state: null,
    });

    vi.mocked(apiConverter.mapApiBodyToDbModelsUpdate).mockReturnValueOnce({
      subject: { subject_id: subjectIdToTest, uuid: testSubjectUuid },
      address: { id: uuidv4() },
    });

    await expect(
      residenceSubmissionService.updateByUsecasesIdService({
        subjects: {
          subject: [
            { generality: { subjectId: { subjectId: subjectIdToTest } } },
          ],
        },
      })
    ).resolves.toBeUndefined();

    const updatedSubjectNoUsecases = await mockedDbInstance
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, subjectIdToTest));

    expect(updatedSubjectNoUsecases.length).toBe(1);
  });
});
