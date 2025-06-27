
// TODO: Fix test models and data

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterAll,
  beforeAll,
  Mock,
  afterEach,
} from "vitest";
import DataPreparationServiceInstance from "../../src/services/residenceSubmissionService.js";
import { DataPreparationTemplate } from "../../src/model/domain/models.js";
import { populateBaseTestData, setupTestDb } from "../setUpTestDb.js";
import { TEST_POSTGRES_SCHEMA } from "../config.js";
import { eq, or } from "drizzle-orm";
import { Purpose as PurposeTable } from "../../src/model/db/purposes.model.js";
import { Subject as SubjectTable } from "../../src/model/db/subjects.model.js";
import { Address as AddressTable } from "../../src/model/db/addresses.model.js";
import { Usecase as UsecaseTable } from "../../src/model/db/usecases.model.js";
import { v4 as uuidV4ToBeMocked } from "uuid";
import { getContext, logger } from "pdnd-common";

let actualUuidV4: () => string;

vi.mock("pdnd-common", () => ({
  getContext: vi.fn(),
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

let testDbInstance: any;
let dbClient: any;
let dbContainer: any;

vi.mock("../../src/model/db/index.js", () => ({
  get db() {
    return testDbInstance;
  },
}));

const MOCK_UUID_SEQ_1 = "11111111-1111-1111-1111-111111111111";
const MOCK_UUID_SEQ_2 = "22222222-2222-2222-2222-222222222222";
const MOCK_UUID_SEQ_3 = "33333333-3333-3333-3333-333333333333";

const EXISTING_PURPOSE_ID = "abcdef01-2345-6789-abcd-ef0123456789";
const EXISTING_SUBJECT_ID_S1 = "s1";
const EXISTING_SUBJECT_UUID_S1 = "fedcba98-7654-3210-fedc-ba9876543210";
const EXISTING_USECASE_ID_S1 = "f8b2c1d0-e6a7-4493-a9b5-2c07d8e1f35a";

const MOCK_ANOTHER_PURPOSE_ID = "a1b2c3d4-a1b2-a1b2-a1b2-a1b2c3d4e5f6";
const MOCK_UNUSED_UUID_FOR_NOT_FOUND = "b2c3d4e5-b2c3-b2c3-b2c3-b2c3d4e5f6a7";

describe("DataPreparationService - Integration Tests", () => {
  beforeAll(async () => {
    const uuidModule = await vi.importActual<typeof import("uuid")>("uuid");
    actualUuidV4 = uuidModule.v4;
    console.log("Setting up test database for DataPreparationService...");
    try {
      const setUp = await setupTestDb();
      testDbInstance = setUp.db;
      dbClient = setUp.client;
      dbContainer = setUp.container;
      console.log("Test database setup complete for DataPreparationService.");
    } catch (error) {
      console.error("Failed to setup test database:", error);
      throw error;
    }
  });

  afterAll(async () => {
    console.log("Cleaning up test database for DataPreparationService...");
    vi.restoreAllMocks();
    if (dbClient) await dbClient.end();
    if (dbContainer) await dbContainer.stop();
    console.log("Test database cleanup complete for DataPreparationService.");
  });

  beforeEach(async () => {
    try {
      await dbClient.query(
        `TRUNCATE TABLE ${TEST_POSTGRES_SCHEMA}.usecases, ${TEST_POSTGRES_SCHEMA}.subjects, ${TEST_POSTGRES_SCHEMA}.addresses, ${TEST_POSTGRES_SCHEMA}.purposes RESTART IDENTITY CASCADE;`
      );
      await populateBaseTestData(dbClient);
    } catch (error) {
      console.error(
        "Errore durante la pulizia/ripopolamento DB nel beforeEach:",
        error
      );
      throw error;
    }

    vi.clearAllMocks();
    (uuidV4ToBeMocked as Mock<[], string>).mockImplementation(() =>
      actualUuidV4()
    );
    (
      getContext as Mock<
        [],
        {
          authData: { purposeId: string; clientId: string };
          correlationId: string;
        }
      >
    ).mockReturnValue({
      authData: { purposeId: EXISTING_PURPOSE_ID, clientId: "test-client" },
      correlationId: "test-correlation-id",
    });
    DataPreparationServiceInstance.appContext = {
      authData: { purposeId: EXISTING_PURPOSE_ID, clientId: "test-client" },
      correlationId: "test-correlation-id",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createCorrectSampleGenericRequest = (
    subjectIdVal: string,
    nameVal: string,
    surnameVal: string
  ): DataPreparationTemplate => ({
    subject: {
      subjectId: subjectIdVal,
      id: `CF-${subjectIdVal.toUpperCase()}`,
      surname: surnameVal,
      name: nameVal,
      gender: "M",
      birthDate: {
        eventDate: "1990-01-01",
        birthPlace: {
          municipality: {
            nameMunicipality: "Testville",
            istatCode: "001001",
            acronymIstatProvince: "TV",
          },
          place: {
            placeDescription: "Testville",
            countryDescription: "Italia",
            codState: "IT",
          },
        },
      },
    },
    address: {
      addressType: "RESIDENZA",
      addressStartDate: "2023-01-01",
      presso: "Presso Test",
      noteaddress: "Nessuna nota particolare.",
      address: {
        municipality: {
          nameMunicipality: "Testville Comune Indirizzo",
          istatCode: "002002",
          acronymIstatProvince: "TI",
        },
        toponym: { toponymDenomination: "Via Codice Pulito" },
        civicNumber: { civicNumber: "101" },
      },
    },
  });

  describe("create", () => {
    it("should create new Purpose, new Subject, new Address, and new Usecase if none exist", async () => {
      const newPurposeTestId = actualUuidV4();
      const newSubjectTestId = "subj-new-all";
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: newPurposeTestId, clientId: "test-client" },
        correlationId: "corr-new-all",
      };
      const genericRequest = createCorrectSampleGenericRequest(
        newSubjectTestId,
        "NomeNuovo",
        "CognomeNuovo"
      );

      const mockFn = uuidV4ToBeMocked as Mock<[], string>;
      mockFn.mockReset();
      mockFn
        .mockReturnValueOnce(actualUuidV4())
        .mockReturnValueOnce(MOCK_UUID_SEQ_1)
        .mockReturnValueOnce(MOCK_UUID_SEQ_2)
        .mockReturnValueOnce(MOCK_UUID_SEQ_3);

      const result = await DataPreparationServiceInstance.create(
        genericRequest
      );
      expect(result).toEqual({ uuid: MOCK_UUID_SEQ_3 });

      const purposeInDb = await testDbInstance
        .select()
        .from(PurposeTable)
        .where(eq(PurposeTable.id, newPurposeTestId));
      expect(purposeInDb).toHaveLength(1);
      const subjectInDb = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(eq(SubjectTable.uuid, MOCK_UUID_SEQ_1));
      expect(subjectInDb).toHaveLength(1);
      expect(subjectInDb[0].subject_id).toBe(newSubjectTestId);
      const addressInDb = await testDbInstance
        .select()
        .from(AddressTable)
        .where(eq(AddressTable.id, MOCK_UUID_SEQ_2));
      expect(addressInDb).toHaveLength(1);
      const usecaseInDb = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.id, MOCK_UUID_SEQ_3));
      expect(usecaseInDb).toHaveLength(1);
      expect(usecaseInDb[0].purpose_id).toBe(newPurposeTestId);
      expect(usecaseInDb[0].subject_id).toBe(MOCK_UUID_SEQ_1);
      expect(usecaseInDb[0].address_id).toBe(MOCK_UUID_SEQ_2);
    });

    it("should use existing Purpose, create new Subject, new Address, and new Usecase", async () => {
      const newSubjectForExistingPurpose = "subj-new-existingP";
      const genericRequest = createCorrectSampleGenericRequest(
        newSubjectForExistingPurpose,
        "NomeSoggEP",
        "CognomeSoggEP"
      );
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: EXISTING_PURPOSE_ID, clientId: "test-client" },
        correlationId: "corr-existingP",
      };

      const mockFn = uuidV4ToBeMocked as Mock<[], string>;
      mockFn.mockReset();
      mockFn
        .mockReturnValueOnce(actualUuidV4())
        .mockReturnValueOnce(MOCK_UUID_SEQ_1)
        .mockReturnValueOnce(MOCK_UUID_SEQ_2)
        .mockReturnValueOnce(MOCK_UUID_SEQ_3);

      const result = await DataPreparationServiceInstance.create(
        genericRequest
      );
      expect(result).toEqual({ uuid: MOCK_UUID_SEQ_3 });

      const subjectInDb = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(eq(SubjectTable.uuid, MOCK_UUID_SEQ_1));
      expect(subjectInDb).toHaveLength(1);
      expect(subjectInDb[0].subject_id).toBe(newSubjectForExistingPurpose);
      const usecaseInDb = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.id, MOCK_UUID_SEQ_3));
      expect(usecaseInDb).toHaveLength(1);
      expect(usecaseInDb[0].purpose_id).toBe(EXISTING_PURPOSE_ID);
      expect(usecaseInDb[0].subject_id).toBe(MOCK_UUID_SEQ_1);
      expect(usecaseInDb[0].address_id).toBe(MOCK_UUID_SEQ_2);
    });

    it("should use existing Subject and existing Purpose, create new Address and new Usecase", async () => {
      const genericRequest = createCorrectSampleGenericRequest(
        EXISTING_SUBJECT_ID_S1,
        "Mario",
        "Rossi"
      );
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: EXISTING_PURPOSE_ID, clientId: "test-client" },
        correlationId: "corr-existingSP",
      };

      const mockFn = uuidV4ToBeMocked as Mock<[], string>;
      mockFn.mockReset();
      mockFn
        .mockReturnValueOnce(actualUuidV4())
        .mockReturnValueOnce(MOCK_UUID_SEQ_1)
        .mockReturnValueOnce(MOCK_UUID_SEQ_2);

      const result = await DataPreparationServiceInstance.create(
        genericRequest
      );
      expect(result).toEqual({ uuid: MOCK_UUID_SEQ_2 });

      const subjectsInDb = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(eq(SubjectTable.subject_id, EXISTING_SUBJECT_ID_S1));
      expect(subjectsInDb).toHaveLength(1);
      expect(subjectsInDb[0].uuid).toBe(EXISTING_SUBJECT_UUID_S1);
      const usecaseInDb = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.id, MOCK_UUID_SEQ_2));
      expect(usecaseInDb).toHaveLength(1);
      expect(usecaseInDb[0].purpose_id).toBe(EXISTING_PURPOSE_ID);
      expect(usecaseInDb[0].subject_id).toBe(EXISTING_SUBJECT_UUID_S1);
      expect(usecaseInDb[0].address_id).toBe(MOCK_UUID_SEQ_1);
    });

    it("should log error and re-throw if a database operation fails due to invalid UUID", async () => {
      const invalidUuidError = expect.objectContaining({ code: "22P02" });
      const invalidPurposeId = "not-a-valid-uuid";
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: invalidPurposeId, clientId: "test-client" },
        correlationId: "corr-fail-select-invalid-uuid",
      };
      const genericRequest = createCorrectSampleGenericRequest(
        "anySubjFail01",
        "Any",
        "Fail"
      );

      await expect(
        DataPreparationServiceInstance.create(genericRequest)
      ).rejects.toThrow(invalidUuidError);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Errore durante il salvataggio"),
        expect.objectContaining({ code: "22P02" })
      );
    });
  });

  describe("getAll", () => {
    it("should return UserModels for the current purposeId using base data", async () => {
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: EXISTING_PURPOSE_ID, clientId: "test-client" },
        correlationId: "corr-get-all-existing",
      };
      const userModels = await DataPreparationServiceInstance.getAll();

      expect(userModels).toBeInstanceOf(Array);
      expect(userModels).toHaveLength(1);
      const s1Model = userModels![0];
      expect(s1Model.uuid).toBe(EXISTING_USECASE_ID_S1);
      expect(s1Model.subject.subjectId).toBe(EXISTING_SUBJECT_ID_S1);
      expect(s1Model.address.address.toponym.toponymDenomination).toBe(
        "VIA MAGNOLIA"
      );
    });

    it("should return an empty array if no usecases exist for a valid purposeId", async () => {
      const purposeWithoutUsecases = actualUuidV4();
      await testDbInstance
        .insert(PurposeTable)
        .values({ id: purposeWithoutUsecases })
        .onConflictDoNothing();

      DataPreparationServiceInstance.appContext = {
        authData: {
          purposeId: purposeWithoutUsecases,
          clientId: "test-client",
        },
        correlationId: "corr-empty-getall-01",
      };

      const userModels = await DataPreparationServiceInstance.getAll();
      expect(userModels).toEqual([]);
    });
  });

  describe("getByUUID", () => {
    it("should return a UserModel if a usecase with the given UUID exists", async () => {
      const userModel = await DataPreparationServiceInstance.getByUUID(
        EXISTING_USECASE_ID_S1
      );
      expect(userModel).not.toBeNull();
      expect(userModel!.uuid).toBe(EXISTING_USECASE_ID_S1);
      expect(userModel!.subject.subjectId).toBe(EXISTING_SUBJECT_ID_S1);
    });

    it("should return null if no usecase is found for a valid (but non-existent) UUID", async () => {
      const nonExistentUsecaseUuid = MOCK_UNUSED_UUID_FOR_NOT_FOUND;
      const userModel = await DataPreparationServiceInstance.getByUUID(
        nonExistentUsecaseUuid
      );
      expect(userModel).toBeNull();
    });

    it("should throw error if UUID format is invalid for getByUUID", async () => {
      const invalidUuid = "not-a-real-uuid-for-get";
      await expect(
        DataPreparationServiceInstance.getByUUID(invalidUuid)
      ).rejects.toThrow(expect.objectContaining({ code: "22P02" }));
      expect(logger.error).toHaveBeenCalledWith(
        "UserService: Errore in getByUUID",
        expect.objectContaining({ code: "22P02" })
      );
    });
  });

  describe("deleteAllByKey", () => {
    it("should delete all usecases, and potentially related subjects and addresses for a given purposeId", async () => {
      const purposeToDelete = actualUuidV4();
      await testDbInstance.insert(PurposeTable).values({ id: purposeToDelete });
      const subj1Uuid = actualUuidV4();
      const addr1Uuid = actualUuidV4();
      const uc1Uuid = actualUuidV4();
      const subj2Uuid = actualUuidV4();
      const addr2Uuid = actualUuidV4();
      const uc2Uuid = actualUuidV4();
      await testDbInstance
        .insert(SubjectTable)
        .values({ uuid: subj1Uuid, subject_id: "delS1" });
      await testDbInstance
        .insert(AddressTable)
        .values({ id: addr1Uuid, address_type: "RES" });
      await testDbInstance.insert(UsecaseTable).values({
        id: uc1Uuid,
        purpose_id: purposeToDelete,
        subject_id: subj1Uuid,
        address_id: addr1Uuid,
      });
      await testDbInstance
        .insert(SubjectTable)
        .values({ uuid: subj2Uuid, subject_id: "delS2" });
      await testDbInstance
        .insert(AddressTable)
        .values({ id: addr2Uuid, address_type: "DOM" });
      await testDbInstance.insert(UsecaseTable).values({
        id: uc2Uuid,
        purpose_id: purposeToDelete,
        subject_id: subj2Uuid,
        address_id: addr2Uuid,
      });

      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: purposeToDelete, clientId: "test-client" },
        correlationId: "corr-delete-all-01",
      };
      const result = await DataPreparationServiceInstance.deleteAllByKey();

      expect(result).toBe(0);

      const usecasesAfter = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.purpose_id, purposeToDelete));
      expect(usecasesAfter).toHaveLength(0);
      const subjectsAfter = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(
          or(eq(SubjectTable.uuid, subj1Uuid), eq(SubjectTable.uuid, subj2Uuid))
        );
      expect(subjectsAfter).toHaveLength(0);
      const addressesAfter = await testDbInstance
        .select()
        .from(AddressTable)
        .where(
          or(eq(AddressTable.id, addr1Uuid), eq(AddressTable.id, addr2Uuid))
        );
      expect(addressesAfter).toHaveLength(0);
    });

    it("should return null if purpose to delete is not found", async () => {
      const nonExistentPurpose = MOCK_UNUSED_UUID_FOR_NOT_FOUND;
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: nonExistentPurpose, clientId: "test-client" },
        correlationId: "corr-delete-all-non-existent",
      };
      const result = await DataPreparationServiceInstance.deleteAllByKey();
      expect(result).toBeNull();
    });

    it("should return null (and log error) if purposeId format is invalid", async () => {
      const invalidPurposeId = "not-a-valid-uuid-for-delete-all";
      DataPreparationServiceInstance.appContext = {
        authData: { purposeId: invalidPurposeId, clientId: "test-client" },
        correlationId: "corr-delete-all-invalid-uuid",
      };

      const result = await DataPreparationServiceInstance.deleteAllByKey();
      expect(result).toBeNull();

      expect(logger.error).toHaveBeenCalledWith(
        "deleteAllByKey: errore nella cancellazione",
        expect.objectContaining({ code: "22P02" })
      );
    });
  });

  describe("deleteByUUID", () => {
    it("should delete usecase, and subject/address if they become orphans", async () => {
      const purposeId = actualUuidV4();
      await testDbInstance.insert(PurposeTable).values({ id: purposeId });
      const subjUuid = actualUuidV4();
      const addrUuid = actualUuidV4();
      const ucUuid = actualUuidV4();
      await testDbInstance
        .insert(SubjectTable)
        .values({ uuid: subjUuid, subject_id: "orphanSubj" });
      await testDbInstance
        .insert(AddressTable)
        .values({ id: addrUuid, address_type: "RES" });
      await testDbInstance.insert(UsecaseTable).values({
        id: ucUuid,
        purpose_id: purposeId,
        subject_id: subjUuid,
        address_id: addrUuid,
      });

      await DataPreparationServiceInstance.deleteByUUID(ucUuid);

      const usecaseAfter = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.id, ucUuid));
      expect(usecaseAfter).toHaveLength(0);
      const subjectAfter = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(eq(SubjectTable.uuid, subjUuid));
      expect(subjectAfter).toHaveLength(0);
      const addressAfter = await testDbInstance
        .select()
        .from(AddressTable)
        .where(eq(AddressTable.id, addrUuid));
      expect(addressAfter).toHaveLength(0);
    });

    it("should delete usecase, but NOT subject/address if they are still referenced", async () => {
      const purposeId = actualUuidV4();
      await testDbInstance.insert(PurposeTable).values({ id: purposeId });
      const subjSharedUuid = actualUuidV4();
      const addrSharedUuid = actualUuidV4();
      const ucToDeleteUuid = actualUuidV4();
      const ucReferencingUuid = actualUuidV4();
      await testDbInstance
        .insert(SubjectTable)
        .values({ uuid: subjSharedUuid, subject_id: "sharedSubj" });
      await testDbInstance
        .insert(AddressTable)
        .values({ id: addrSharedUuid, address_type: "RES" });
      await testDbInstance.insert(UsecaseTable).values({
        id: ucToDeleteUuid,
        purpose_id: purposeId,
        subject_id: subjSharedUuid,
        address_id: addrSharedUuid,
      });
      await testDbInstance.insert(UsecaseTable).values({
        id: ucReferencingUuid,
        purpose_id: purposeId,
        subject_id: subjSharedUuid,
        address_id: addrSharedUuid,
      });

      await DataPreparationServiceInstance.deleteByUUID(ucToDeleteUuid);

      const usecaseAfter = await testDbInstance
        .select()
        .from(UsecaseTable)
        .where(eq(UsecaseTable.id, ucToDeleteUuid));
      expect(usecaseAfter).toHaveLength(0);
      const subjectAfter = await testDbInstance
        .select()
        .from(SubjectTable)
        .where(eq(SubjectTable.uuid, subjSharedUuid));
      expect(subjectAfter).toHaveLength(1);
      const addressAfter = await testDbInstance
        .select()
        .from(AddressTable)
        .where(eq(AddressTable.id, addrSharedUuid));
      expect(addressAfter).toHaveLength(1);
    });

    it("should do nothing and log warning if usecase to delete by UUID is not found", async () => {
      const nonExistentUsecaseUuid = MOCK_UNUSED_UUID_FOR_NOT_FOUND;
      await DataPreparationServiceInstance.deleteByUUID(nonExistentUsecaseUuid);
      expect(logger.warn).toHaveBeenCalledWith(
        `Usecase con UUID ${nonExistentUsecaseUuid} non trovato`
      );
    });

    it("should throw error if UUID format for deletion is invalid", async () => {
      const invalidUuid = "not-a-real-uuid-for-delete";
      await expect(
        DataPreparationServiceInstance.deleteByUUID(invalidUuid)
      ).rejects.toThrow(expect.objectContaining({ code: "22P02" }));
      expect(logger.error).toHaveBeenCalledWith(
        `deleteByUUID - Errore durante la cancellazione`,
        expect.objectContaining({ code: "22P02" })
      );
    });
  });
});
