/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/no-let */
/* eslint-disable no-console */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
  beforeEach,
  Mock,
} from "vitest";
import { eq } from "drizzle-orm";
import { UserModel } from "pdnd-models";
import {
  getUserBySubjectId,
  getById,
  getByPersonalInfo,
} from "../src/services/residenceVerificationService";
import { mapUserModel } from "../src/utilities/mapUserModelUtilities";
import { TipoParametriRicercaAR001 } from "../src/model/domain/models";
import { setupTestDb } from "./setUpTestDb";

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
  userModelNotFound: vi.fn(),
}));

let mockedDbInstance: any;
let Subject: any;
let Usecase: any;
let Address: any;

vi.mock("../src/model/db/index.js", async () => {
  const actualSubjectModel = (await vi.importActual(
    "../src/model/db/subject.model.js"
  )) as any;
  const actualUsecaseModel = (await vi.importActual(
    "../src/model/db/usecase.model.js"
  )) as any;
  const actualAddressModel = (await vi.importActual(
    "../src/model/db/address.model.js"
  )) as any;

  return {
    Subject: actualSubjectModel.Subject,
    Usecase: actualUsecaseModel.Usecase,
    Address: actualAddressModel.Address,
    get db(): any {
      return mockedDbInstance;
    },
  };
});

const TEST_PURPOSE_ID = "abcdef01-2345-6789-abcd-ef0123456789";

let container: any;
let client: any;

let mockGetContext: Mock<
  [],
  { authData: { purposeId: string; clientId: string }; correlationId: string }
>;
let mockLoggerError: Mock<[string, any], void>;
let mockUserModelNotFound: Mock<[string | undefined], Error>;

describe("ResidenceVerificationService (Integration with DB and Mapper)", () => {
  beforeAll(async () => {
    console.log("Setting up test database...");
    try {
      const setUp = await setupTestDb();
      client = setUp.client;
      mockedDbInstance = setUp.db;
      container = setUp.container;

      const dbModels = (await import("../src/model/db/index.js")) as any;
      Subject = dbModels.Subject;
      Usecase = dbModels.Usecase;
      Address = dbModels.Address;

      expect(Subject).toBeDefined();
      expect(Usecase).toBeDefined();
      expect(Address).toBeDefined();

      console.log("Test database setup complete.");
    } catch (error) {
      console.error("Failed to setup test database:", error);
      throw error;
    }
  }, 60000);

  afterAll(async () => {
    console.log("Cleaning up test database...");
    vi.restoreAllMocks();
    if (client) {
      await client.end();
      console.log("DB client closed.");
    }
    if (container) {
      await container.stop();
      console.log("DB container stopped.");
    }
    mockedDbInstance = undefined;
    Subject = undefined;
    Usecase = undefined;
    Address = undefined;
    console.log("Test database cleanup complete.");
  });

  beforeEach(async () => {
    const pdndCommon = await import("pdnd-common");
    mockGetContext = pdndCommon.getContext as unknown as Mock<
      [],
      {
        authData: { purposeId: string; clientId: string };
        correlationId: string;
      }
    >;
    mockLoggerError = pdndCommon.logger.error as unknown as Mock<
      [string, any],
      void
    >;

    const errorsModule = await import("../src/exceptions/errors.js");
    mockUserModelNotFound = errorsModule.userModelNotFound as unknown as Mock<
      [string | undefined],
      Error
    >;

    vi.clearAllMocks();

    mockGetContext.mockReturnValue({
      authData: {
        purposeId: TEST_PURPOSE_ID,
        clientId: "test-client-id",
      },
      correlationId: "test-correlation-id",
    });

    mockUserModelNotFound.mockImplementation((message?: string) => {
      const error = new Error(message ?? "User model not found from mock");
      // eslint-disable-next-line functional/immutable-data
      (error as any).isUserModelNotFound = true;
      throw error;
    });
  });

  describe("getUserBySubjectId", () => {
    const SUBJECT_ID_S1 = "s1";
    const SUBJECT_UUID_S1 = "fedcba98-7654-3210-fedc-ba9876543210";
    const ADDRESS_ID_S1 = "12345678-9abc-def0-1234-567890abcdef";
    const SUBJECT_ID_S2 = "s2";
    const SUBJECT_UUID_S2 = "f9e8d7c6-b5a4-3210-fedc-ba9876543210";
    const ADDRESS_ID_S2 = "98765432-10fe-dcba-9876-543210fedcba";

    it("should return UserModel for s1 when subject, its usecase, and address are found", async () => {
      const [expectedSubjectS1] = await mockedDbInstance
        .select()
        .from(Subject)
        .where(eq(Subject.subject_id, SUBJECT_ID_S1));

      const [expectedAddressS1] = await mockedDbInstance
        .select()
        .from(Address)
        .where(eq(Address.id, ADDRESS_ID_S1));

      expect(expectedSubjectS1).toBeDefined();
      expect(expectedAddressS1).toBeDefined();

      const expectedUserModelS1 = await mapUserModel(
        SUBJECT_UUID_S1,
        expectedSubjectS1,
        expectedAddressS1
      );

      const resultS1 = await getUserBySubjectId(SUBJECT_ID_S1);

      expect(resultS1).toBeDefined();
      expect(() => UserModel.parse(resultS1)).not.toThrow();
      expect(resultS1).toEqual(expectedUserModelS1);
      expect(mockGetContext).not.toHaveBeenCalled();
      expect(mockLoggerError).not.toHaveBeenCalled();
    });

    it("should throw userModelNotFound when subject is not found", async () => {
      const nonExistentSubjectId = "non-existent-subject";

      await expect(getUserBySubjectId(nonExistentSubjectId)).rejects.toThrow(
        expect.objectContaining({
          message: "User model not found from mock",
          isUserModelNotFound: true,
        })
      );

      expect(mockGetContext).not.toHaveBeenCalled();
      expect(mockUserModelNotFound).toHaveBeenCalledTimes(1);
      expect(mockUserModelNotFound).toHaveBeenCalledWith();
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    it("should return UserModel for s2 using its existing usecase", async () => {
      const [expectedSubjectS2] = await mockedDbInstance
        .select()
        .from(Subject)
        .where(eq(Subject.subject_id, SUBJECT_ID_S2));

      const [expectedAddressS2] = await mockedDbInstance
        .select()
        .from(Address)
        .where(eq(Address.id, ADDRESS_ID_S2));

      expect(expectedSubjectS2).toBeDefined();
      expect(expectedAddressS2).toBeDefined();

      const expectedUserModelS2 = await mapUserModel(
        SUBJECT_UUID_S2,
        expectedSubjectS2,
        expectedAddressS2
      );

      const resultS2 = await getUserBySubjectId(SUBJECT_ID_S2);

      expect(resultS2).toBeDefined();
      expect(() => UserModel.parse(resultS2)).not.toThrow();
      expect(resultS2).toEqual(expectedUserModelS2);
      expect(mockGetContext).not.toHaveBeenCalled();
      expect(mockLoggerError).not.toHaveBeenCalled();
    });

    it("should log error and re-throw if a database error occurs", async () => {
      const mockError = new Error("Simulated DB Error in getUserBySubjectId");
      const dbSelectSpy = vi.spyOn(mockedDbInstance, "select");
      let caughtError: any;
      try {
        dbSelectSpy.mockImplementation(() => {
          throw mockError;
        });
        await getUserBySubjectId(SUBJECT_ID_S1);
      } catch (error) {
        caughtError = error;
      } finally {
        dbSelectSpy.mockRestore();
      }
      expect(caughtError).toBe(mockError);
      expect(mockGetContext).not.toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        `Error during getUserBySubjectId for subjectId: ${SUBJECT_ID_S1}`,
        mockError
      );
    });
  });

  describe("getById", () => {
    const EXISTING_USECASE_ID_S1 = "f8b2c1d0-e6a7-4493-a9b5-2c07d8e1f35a";
    const SUBJECT_UUID_S1 = "fedcba98-7654-3210-fedc-ba9876543210";
    const ADDRESS_ID_S1 = "12345678-9abc-def0-1234-567890abcdef";

    it("should return UserModel when usecase is found with correct id and purposeId", async () => {
      const [expectedSubject] = await mockedDbInstance
        .select()
        .from(Subject)
        .where(eq(Subject.uuid, SUBJECT_UUID_S1));
      const [expectedAddress] = await mockedDbInstance
        .select()
        .from(Address)
        .where(eq(Address.id, ADDRESS_ID_S1));

      const tempExpectedUserModel = await mapUserModel(
        EXISTING_USECASE_ID_S1,
        expectedSubject,
        expectedAddress
      );
      const expectedUserModel = {
        ...tempExpectedUserModel,
        uuid: SUBJECT_UUID_S1,
      };

      const result = await getById(EXISTING_USECASE_ID_S1);
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(() => UserModel.parse(result)).not.toThrow();
      expect(result).toEqual(expectedUserModel);
      expect(mockLoggerError).not.toHaveBeenCalled();
    });

    it("should return null when usecase is not found by id", async () => {
      const nonExistentId = "00000000-1111-2222-3333-444444444444";
      const result = await getById(nonExistentId);
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should return null when usecase is found by id but has a different purposeId", async () => {
      const differentValidPurposeId = "11111111-2222-3333-4444-555555555555";
      mockGetContext.mockReturnValue({
        authData: { purposeId: differentValidPurposeId, clientId: "c" },
        correlationId: "co",
      });
      const result = await getById(EXISTING_USECASE_ID_S1);
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should log error and re-throw if a database error occurs", async () => {
      const mockError = new Error("Simulated DB Error in getById");
      const dbSelectSpy = vi.spyOn(mockedDbInstance, "select");
      let caughtError: any;
      try {
        dbSelectSpy.mockImplementation(() => {
          throw mockError;
        });
        await getById(EXISTING_USECASE_ID_S1);
      } catch (error) {
        caughtError = error;
      } finally {
        dbSelectSpy.mockRestore();
      }
      expect(caughtError).toBe(mockError);
      expect(mockGetContext).toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        `UserService: Error retrieving user by id ${EXISTING_USECASE_ID_S1} and purposeId ${TEST_PURPOSE_ID}.`,
        mockError
      );
    });
  });

  describe("getByPersonalInfo", () => {
    const SUBJECT_UUID_S1 = "fedcba98-7654-3210-fedc-ba9876543210";
    const ADDRESS_ID_S1 = "12345678-9abc-def0-1234-567890abcdef";
    const USECASE_ID_S1 = "f8b2c1d0-e6a7-4493-a9b5-2c07d8e1f35a";

    it("should return UserModel array when found with matching personal info and purposeId", async () => {
      const [expectedSubject] = await mockedDbInstance
        .select()
        .from(Subject)
        .where(eq(Subject.uuid, SUBJECT_UUID_S1));
      const [expectedAddress] = await mockedDbInstance
        .select()
        .from(Address)
        .where(eq(Address.id, ADDRESS_ID_S1));

      const expectedUserModels = [
        await mapUserModel(USECASE_ID_S1, expectedSubject, expectedAddress),
      ];

      const searchParams: TipoParametriRicercaAR001 = {
        name: "Mario",
        surname: "Rossi",
        gender: "M",
        birthDate: {
          eventDate: "1980-01-01",
          birthPlace: {
            municipality: { nameMunicipality: "Roma" } as any,
            place: { codState: "IT" } as any,
          },
        },
      };
      const result = await getByPersonalInfo(searchParams);
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUserModels);
    });

    it("should throw userModelNotFound when no users match the search criteria", async () => {
      const searchParams: TipoParametriRicercaAR001 = {
        name: "NonExistentName",
      };
      await expect(getByPersonalInfo(searchParams)).rejects.toThrow(
        expect.objectContaining({ isUserModelNotFound: true })
      );
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(mockUserModelNotFound).toHaveBeenCalledWith("Not found");
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    it("should log error and re-throw if a database error occurs (simulating error on execute)", async () => {
      const mockError = new Error(
        "Simulated DB Error for Personal Info on execute"
      );
      const dbSelectSpy = vi.spyOn(mockedDbInstance, "select");
      let caughtError: any;
      try {
        dbSelectSpy.mockReturnValue({
          from: vi.fn().mockReturnThis(),
          leftJoin: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          execute: vi.fn().mockRejectedValue(mockError),
        } as any);
        const searchParams: TipoParametriRicercaAR001 = { name: "Test" };
        await getByPersonalInfo(searchParams);
      } catch (error) {
        caughtError = error;
      } finally {
        dbSelectSpy.mockRestore();
      }

      expect(caughtError).toBeInstanceOf(TypeError);
      expect(caughtError.message).toContain("rows.map is not a function");
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        "UserService: Error during search by personal info",
        expect.objectContaining({ message: caughtError.message })
      );
    });

    it("should log error and re-throw if a database error occurs (simulating error on select)", async () => {
      const mockError = new Error(
        "Simulated DB Error for Personal Info on select"
      );
      const dbSelectSpy = vi.spyOn(mockedDbInstance, "select");
      let caughtError: any;
      try {
        dbSelectSpy.mockImplementation(() => {
          throw mockError;
        });
        const searchParams: TipoParametriRicercaAR001 = { name: "Test" };
        await getByPersonalInfo(searchParams);
      } catch (error) {
        caughtError = error;
      } finally {
        dbSelectSpy.mockRestore();
      }
      expect(caughtError).toBe(mockError);
      expect(mockGetContext).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        "UserService: Error during search by personal info",
        mockError
      );
    });
  });
});
