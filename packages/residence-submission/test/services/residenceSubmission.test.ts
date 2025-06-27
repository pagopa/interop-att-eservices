import DataPreparationService from "../../src/services/residenceSubmissionService.js";
import repo from "../../src/repository/dataPreparationRepository.js";
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterAll,
  beforeAll,
} from "vitest";
import { setupTestDb, populateBaseTestData } from "../setUpTestDb.js";
import { TEST_POSTGRES_SCHEMA } from "../config.js";
import { v4 as uuidV4ToBeMocked } from "uuid";
import { getContext, logger } from "pdnd-common";

vi.mock("../../src/repositories/dataPreparation.repository.js");
vi.mock("uuid", () => ({ v4: vi.fn() }));
vi.mock("pdnd-common", async () => {
  const actual = await vi.importActual<typeof import("pdnd-common")>(
    "pdnd-common",
  );
  return {
    ...actual,
    getContext: vi.fn(),
    logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
  };
});

describe("DataPreparationService", () => {
  let dbClient: any;
  let dbContainer: any;

  beforeAll(async () => {
    // Usa setupTestDb per dimostrare l'import
    const setUp = await setupTestDb();
    setUp.db;
    dbClient = setUp.client;
    dbContainer = setUp.container;
  });

  afterAll(async () => {
    if (dbClient) await dbClient.end();
    if (dbContainer) await dbContainer.stop();
  });

  beforeEach(async () => {
    // Usa populateBaseTestData e TEST_POSTGRES_SCHEMA per dimostrare l'import
    if (dbClient) {
      await dbClient.query(
        `TRUNCATE TABLE ${TEST_POSTGRES_SCHEMA}.usecases, ${TEST_POSTGRES_SCHEMA}.subjects, ${TEST_POSTGRES_SCHEMA}.addresses, ${TEST_POSTGRES_SCHEMA}.purposes RESTART IDENTITY CASCADE;`
      );
      await populateBaseTestData(dbClient);
    }
    vi.clearAllMocks();
    // Usa getContext per dimostrare l'import
    (getContext as any).mockReturnValue({
      authData: { purposeId: "purpose-id", clientId: "client-id" },
      correlationId: "corr-id",
    });
  });

  // Dati di test coerenti con setupTestDb e populateBaseTestData
  const EXISTING_PURPOSE_ID = "abcdef01-2345-6789-abcd-ef0123456789";
  const sampleRequest = {
    subjects: {
      subject: [
        {
          generality: {
            subjectId: { subjectId: "s1" },
            surname: "Rossi",
            name: "Mario",
            gender: "M",
            birthDate: "1980-01-01",
            birthPlace: {
              municipality: {
                nameMunicipality: "Roma",
                istatCode: "058091",
                acronymIstatProvince: "RM",
                placeDescription: "Municipio I",
              },
              place: {
                placeDescription: "Roma",
                countryDescription: "Italia",
                codState: "IT",
                provinceCounty: "Lazio",
              },
            },
          },
          identifiers: { id: "SUB001" },
        },
      ],
    },
    address: {
      addressType: "RESIDENZA",
      addressStartDate: "2023-01-01",
      presso: "Presso Test",
      noteAddress: "Nessuna nota particolare.",
      address: {
        municipality: {
          nameMunicipality: "Roma",
          istatCode: "058091",
          acronymIstatProvince: "RM",
          placeDescription: "Municipio I",
        },
        toponym: { toponymDenomination: "VIA MAGNOLIA" },
        civicNumber: { civicNumber: "12B" },
      },
    },
  };

  it("create should create new records", async () => {
    // data di input...
    vi.mocked(uuidV4ToBeMocked)
      .mockReturnValueOnce("u1")
      .mockReturnValueOnce("u2")
      .mockReturnValueOnce("u3");
    vi.mocked(repo.findSubjectById).mockResolvedValue(null);
    vi.mocked(repo.findUsecasesById).mockResolvedValue([]);

    const result = await DataPreparationService.create(sampleRequest);
    expect(result).toEqual({ uuid: "u3" });
    expect(repo.createPurpose).toHaveBeenCalledWith({
      id: EXISTING_PURPOSE_ID,
    });
    expect(repo.createSubject).toHaveBeenCalled();
    expect(repo.createAddress).toHaveBeenCalled();
    expect(repo.createUsecase).toHaveBeenCalledWith(
      expect.objectContaining({ id: "u3" }),
    );
    logger.info("Test create executed"); // Usa logger per evitare warning
  });

  it("getBySubjectId success", async () => {
    vi.mocked(repo.findSubjectById).mockResolvedValue({
      uuid: "sub-uuid",
      subject_id: "sub-id",
      id: "",
      surname: "string",
      name: "string",
      gender: "string",
      birth_event_date: "string",
      birth_exceptional_place: "string",
      birth_municipality_name: "string",
      birth_municipality_istat_code: "string",
      birth_municipality_acronym_istat_province: "string",
      birth_municipality_place_description: "string",
      birth_place_description: "string",
      birth_country_description: "string",
      birth_cod_state: "string",
      birth_province_county: "string"
    });
    vi.mocked(repo.findUsecasesById).mockResolvedValue([
      { id: "uc1", subject_id: "sub-uuid", address_id: "a1", purpose_id: "p1" },
    ]);
    const result = await DataPreparationService.getBySubjectId("sub-id");
    expect(result).toHaveLength(1);
    logger.debug("Test getBySubjectId success");
  });

  it("getBySubjectId no subject", async () => {
    vi.mocked(repo.findSubjectById).mockResolvedValue(null);
    const result = await DataPreparationService.getBySubjectId("no-id");
    expect(result).toBeNull();
    logger.warn("Test getBySubjectId no subject");
  });

  it("delete should cleanup", async () => {
    vi.mocked(repo.findSubjectById).mockResolvedValue({
      uuid: "sub-uuid",
      subject_id: "subj",
      id: "",
      surname: "string",
      name: "string",
      gender: "string",
      birth_event_date: "string",
      birth_exceptional_place: "string",
      birth_municipality_name: "string",
      birth_municipality_istat_code: "string",
      birth_municipality_acronym_istat_province: "string",
      birth_municipality_place_description: "string",
      birth_place_description: "string",
      birth_country_description: "string",
      birth_cod_state: "string",
      birth_province_county: "string"
    });
    vi.mocked(repo.findUsecasesById).mockResolvedValue([
      { id: "uc1", subject_id: "sub-uuid", address_id: "a1", purpose_id: "p1" },
    ]);
    await DataPreparationService.delete("subj");
    expect(repo.deleteUsecaseById).toHaveBeenCalledWith("uc1");
    expect(repo.deleteAddressById).toHaveBeenCalledWith("a1");
    expect(repo.deleteSubjectById).toHaveBeenCalledWith("subj");
    expect(repo.deletePurposeById).toHaveBeenCalledWith("p1");
    logger.error("Test delete executed");
  });
});
