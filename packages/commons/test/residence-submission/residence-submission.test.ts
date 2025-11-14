/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { DataPreparationRepository } from "../../src/repositories/residence-submission/dataPreparation.js";
import {
  mapApiBodyToDbModels,
  mapApiBodyToDbModelsUpdate,
} from "../../src/utility/mapRequestAr003.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  TrialService: {
    insert: vi.fn(),
  },
  SHService: {
    findSeedByEserviceId: vi.fn(),
    getNextSignalId: vi.fn(),
    sendSignal: vi.fn(),
  },
  getEserviceIdFromToken: vi.fn(),
  generateObjectId: vi.fn(),
  HashAlgorithm: {
    SHA256: "SHA256",
  },
  authenticationCorrelationMiddleware: vi.fn(() => vi.fn()),
  integrityValidationMiddleware: vi.fn(() => vi.fn()),
  auditValidationMiddleware: vi.fn(() => vi.fn()),
  shClientConfig: vi.fn(() => ({})),
}));

vi.mock(
  "../../src/repositories/residence-submission/dataPreparation.js",
  () => ({
    DataPreparationRepository: {
      findSubjectById: vi.fn(),
      findAddressesBySubjectId: vi.fn(),
      createSubject: vi.fn(),
      createAddress: vi.fn(),
      updateSubjectById: vi.fn(),
      updateAddressById: vi.fn(),
      deleteSubjectById: vi.fn(),
      deleteAddressById: vi.fn(),
    },
  })
);
vi.mock("../../src/utility/mapRequestAr003.js", () => ({
  mapApiBodyToDbModels: vi.fn(),
  mapApiBodyToDbModelsUpdate: vi.fn(),
}));
vi.mock("../../repositories/residence-submission/dataPreparation.js");
vi.mock("../../utility/mapRequestAr003.js");

vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(() => "--- FAKE MOCKED KEY ---"),
  },
  readFileSync: vi.fn(() => "--- FAKE MOCKED KEY ---"),
}));

vi.mock("../../src/config/m2mConfig.js", () => ({
  m2mConfig: vi.fn(() => ({
    privateKeyPath: "fake/path/to/key.priv",
  })),
}));

vi.mock("../../src/utility/client-assertion-m2m.js", () => ({
  exec_pdnd_client_assertion_m2m: vi.fn(() => "fake-client-assertion"),
  get_pdnd_token_m2m: vi.fn(() => Promise.resolve("fake-m2m-token")),
}));

import { ResidenceSubmissionService } from "../../src/services/reisdence-submission/index.js";

const mockSubjectId = "RSSMRA80A01H501U";

export const mockSubject = {
  uuid: uuidv4(),
  id: "ID-12345",
  subject_id: "RSSMRA80A01H501U",

  surname: "Rossi",
  name: "Mario",
  gender: "M",
  birth_event_date: "1980-01-01",
  birth_exceptional_place: null,
  birth_municipality_name: "Roma",
  birth_municipality_istat_code: "H501",
  birth_municipality_acronym_istat_province: "RM",
  birth_municipality_place_description: "Capitale d'Italia",
  birth_place_description: "Ospedale San Camillo",
  birth_country_description: "Italia",
  birth_cod_state: "IT",
  birth_province_county: "Provincia di Roma",
};

export const mockAddress = {
  id: "123e4667-e89b-12d3-a456-426614174000",

  address_type: "residence",
  note_address: "Indirizzo principale del soggetto",
  address_start_date: "2020-01-15",
  presso: "Presso famiglia Rossi",
  address_municipality_name: "Roma",
  address_municipality_istat_code: "H501",
  address_municipality_acronym_istat_province: "RM",
  address_municipality_place_description: "Zona EUR",

  toponym_cod_type: "STR",
  toponym_type: "Via",
  toponym_origin_type: "Civico storico",
  toponym_cod: "VIA-001",
  toponym_denomination: "Via del Corso",
  toponym_source: "Anagrafe toponomastica comunale",

  civic_cod: "CIV-001",
  civic_source: "Municipio Roma I",
  civic_number: "123",
  metric: "A",
  prog_snc: "SNC",
  letter: "A",
  exponent1: "1",
  color: "Rosso",

  internal_court: "Cortile interno",
  internal_stairs: "Scala B",
  internal1: "Interno 5",
  esp_internal1: "Piano rialzato",
  internal2: "Scala 2",
  esp_internal2: "Secondo piano",
  external_stairs: "Scala esterna destra",
  secondary: "Edificio secondario",
  floor: "Piano terra",
  nui: "NUI-0012345",
  isolated: "Fabbricato isolato",

  latitude: "41.9027836",
  longitude: "12.4963655",

  foreign_cap: null,
  foreign_place_description: null,
  foreign_country_description: null,
  foreign_country_state: null,
  foreign_province_county: null,
  foreign_toponym_denomination: null,
  foreign_toponym_civic_number: null,

  consulate_cod: null,
  consulate_description: null,

  subject_id: "RSSMRA80A01H501U",
};

export const mockRequest = {
  subjects: {
    subject: [
      {
        generality: {
          subjectId: {
            subjectId: mockSubjectId,
            subjectIdValidity: "2025-12-31",
            dataAttributionValidity: "2023-01-15",
          },
          surname: "Rossi",
          noSurname: "",
          name: "Mario",
          noName: "",
          gender: "M",
          birthDate: "1980-01-01",
          noDay: "",
          noMonth: "",
          birthPlace: {
            exceptionalPlace: "",
            municipality: {
              nameMunicipality: "Roma",
              istatCode: "H501",
              acronymIstatProvince: "RM",
              placeDescription: "Capitale d'Italia",
            },
            place: {
              placeDescription: "Ospedale San Camillo",
              countryDescription: "Italia",
              codState: "IT",
              provinceCounty: "Provincia di Roma",
            },
          },
          AIRESubject: "N",
          yearExpatriation: "",
          idCommonSubjectData: {
            idCommonSubjectDataIstat: "IT-ISTAT-123456",
            idSubjectData: "SD-001",
          },
          idSubjectData: "SD-001",
          note: "Soggetto residente, nessuna annotazione speciale",
        },
        address: [
          {
            addressType: "residence",
            noteaddress: "Indirizzo principale di residenza",
            address: {
              cap: "00100",
              municipality: {
                nameMunicipality: "Roma",
                istatCode: "H501",
                acronymIstatProvince: "RM",
                placeDescription: "Zona EUR",
              },
              fraction: "Parioli",
              toponym: {
                codType: "STR",
                type: "Via",
                originType: "Civico storico",
                toponymCod: "VIA-001",
                toponymDenomination: "Via del Corso",
                toponymSource: "Anagrafe toponomastica comunale",
              },
              civicNumber: {
                civicCod: "CIV-001",
                civicSource: "Municipio Roma I",
                civicNumber: "123",
                metric: "A",
                progSNC: "SNC",
                letter: "A",
                exponent1: "1",
                color: "Rosso",
                internalCivic: {
                  court: "Cortile interno",
                  stairs: "Scala B",
                  internal1: "Interno 5",
                  espInternal1: "Piano rialzato",
                  internal2: "Scala 2",
                  espInternal2: "Secondo piano",
                  externalStairs: "Scala esterna destra",
                  secondary: "Edificio secondario",
                  floor: "Piano terra",
                  nui: "NUI-0012345",
                  isolated: "Fabbricato isolato",
                },
              },
            },
            foreignState: {
              foreignAddress: {
                cap: "",
                place: {
                  placeDescription: "",
                  countryDescription: "",
                  countryState: "",
                  provinceCounty: "",
                },
                toponym: {
                  denomination: "",
                  civicNumber: "",
                },
              },
              consulate: {
                consulateCod: "",
                consulateDescription: "",
              },
            },
            presso: "Presso famiglia Rossi",
            addressStartDate: "2020-01-15",
            coords: {
              latitude: 41.9027836,
              longitude: 12.4963655,
            },
          },
        ],
        identifiers: {
          id: "ID-12345",
        },
        deathDate: {
          eventDate: "",
          noDay: "",
          noMonth: "",
          eventPlace: {
            exceptionalPlace: "",
            municipality: {
              nameMunicipality: "",
              istatCode: "",
              acronymIstatProvince: "",
              placeDescription: "",
            },
            place: {
              placeDescription: "",
              countryDescription: "",
              codState: "",
              provinceCounty: "",
            },
          },
          eventAct: {
            act: {
              municipalOffice: "",
              year: "",
              part: "",
              series: "",
              actNumber: "",
              volume: "",
              dateFormationAct: "",
              transcribed: "",
              municipalityRegistration: {
                nameMunicipality: "",
                istatCode: "",
                acronymIstatProvince: "",
                placeDescription: "",
              },
            },
            actANSC: {
              idANSC: "",
              municipalOffice: "",
              municipalNumber: "",
              dateFormationAct: "",
              transcribed: "",
              act: "",
              municipalityRegistration: {
                nameMunicipality: "",
                istatCode: "",
                acronymIstatProvince: "",
                placeDescription: "",
              },
            },
          },
        },
      },
    ],
  },
};

const mockMappedData = {
  subject: { ...mockSubject },
  addresses: [mockAddress],
};

const mockMappedUpdateData = {
  subject: { ...mockSubject },
  addresses: [{ ...mockAddress, address_type: "domicile" }],
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("ResidenceSubmissionService", () => {
  describe("getBySubjectId", () => {
    it("should return subject when found", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject
      );

      const result = await ResidenceSubmissionService.getBySubjectId(
        mockSubjectId
      );

      expect(DataPreparationRepository.findSubjectById).toHaveBeenCalledWith(
        mockSubjectId
      );
      expect(result).toEqual(mockSubject);
    });

    it("should throw error if subjectId is missing", async () => {
      await expect(
        ResidenceSubmissionService.getBySubjectId("")
      ).rejects.toThrow("The subjectId is missing or invalid");

      expect(DataPreparationRepository.findSubjectById).not.toHaveBeenCalled();
    });

    it("should throw error if subject not found", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        null
      );

      await expect(
        ResidenceSubmissionService.getBySubjectId(mockSubjectId)
      ).rejects.toThrow("The subjectId is missing or invalid");
    });
  });

  describe("create", () => {
    it("should create subject and addresses when not exists", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        null
      );
      vi.mocked(mapApiBodyToDbModels).mockReturnValue(mockMappedData);

      await ResidenceSubmissionService.create(mockRequest);

      expect(mapApiBodyToDbModels).toHaveBeenCalledWith(
        mockRequest.subjects.subject[0]
      );
      expect(DataPreparationRepository.createSubject).toHaveBeenCalledWith(
        mockSubject
      );
      expect(DataPreparationRepository.createAddress).toHaveBeenCalledWith({
        ...mockAddress,
        subject_id: mockSubjectId,
      });
    });

    it("should throw error if subject already exists", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject
      );

      await expect(
        ResidenceSubmissionService.create(mockRequest)
      ).rejects.toThrow(
        `Subject with subject_id ${mockSubjectId} already exists.`
      );

      expect(DataPreparationRepository.createSubject).not.toHaveBeenCalled();
    });

    it("should throw error if no subject or address in request", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        null
      );
      vi.mocked(mapApiBodyToDbModels).mockReturnValue({
        subject: mockSubject,
        addresses: [],
      });
      const invalidRequest = {
        subjects: {
          subject: [
            {
              generality: {
                subjectId: {
                  subjectId: mockSubjectId,
                },
              },
            },
          ],
        },
      };
      await expect(
        ResidenceSubmissionService.create(invalidRequest as any)
      ).rejects.toThrow(
        "Subject or at least one address is missing in the request."
      );
      expect(DataPreparationRepository.createSubject).not.toHaveBeenCalled();
    });
  });

  describe("updateBySubjectId", () => {
    it("should update subject and existing addresses", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject
      );
      vi.mocked(mapApiBodyToDbModelsUpdate).mockReturnValue(
        mockMappedUpdateData
      );
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([mockAddress]);

      await ResidenceSubmissionService.updateBySubjectId(mockRequest);

      expect(DataPreparationRepository.findSubjectById).toHaveBeenCalledWith(
        mockSubjectId
      );
      expect(mapApiBodyToDbModelsUpdate).toHaveBeenCalledWith(mockRequest);
      expect(DataPreparationRepository.updateSubjectById).toHaveBeenCalledWith(
        mockSubjectId,
        mockMappedUpdateData.subject
      );
      expect(DataPreparationRepository.updateAddressById).toHaveBeenCalledWith(
        mockAddress.subject_id,
        mockMappedUpdateData.addresses[0]
      );
    });

    it("should skip update for non-existing addresses", async () => {
      const newAddress = {
        ...mockAddress,
        id: "ADDR-NEW",
        address_type: "holiday",
      };

      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject
      );

      vi.mocked(mapApiBodyToDbModelsUpdate).mockReturnValue({
        subject: mockSubject,
        addresses: [mockMappedUpdateData.addresses[0], newAddress],
      });
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([mockAddress]);

      await ResidenceSubmissionService.updateBySubjectId(mockRequest);

      expect(DataPreparationRepository.updateAddressById).toHaveBeenCalledWith(
        mockAddress.subject_id,
        expect.objectContaining({ subject_id: mockAddress.subject_id })
      );
      expect(DataPreparationRepository.createAddress).not.toHaveBeenCalled();
    });
    it("should throw error if subjects array is invalid", async () => {
      const invalidRequest = { subjects: { subject: null } };

      await expect(
        ResidenceSubmissionService.updateBySubjectId(invalidRequest as any)
      ).rejects.toThrow("Missing or invalid 'subjects.subject' array");
    });
  });

  describe("delete", () => {
    it("should delete subject and all associated addresses", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject
      );
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([mockAddress]);

      await ResidenceSubmissionService.delete(mockSubjectId);

      expect(DataPreparationRepository.findSubjectById).toHaveBeenCalledWith(
        mockSubjectId
      );
      expect(
        DataPreparationRepository.findAddressesBySubjectId
      ).toHaveBeenCalledWith(mockSubjectId);
      expect(DataPreparationRepository.deleteAddressById).toHaveBeenCalledWith(
        mockAddress.id
      );
      expect(DataPreparationRepository.deleteSubjectById).toHaveBeenCalledWith(
        mockSubjectId
      );
    });

    it("should throw error if subjectId is invalid", async () => {
      await expect(ResidenceSubmissionService.delete("")).rejects.toThrow(
        "The subjectId is missing or invalid"
      );

      expect(
        DataPreparationRepository.deleteSubjectById
      ).not.toHaveBeenCalled();
    });

    it("should throw error if subject not found", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        null
      );

      await expect(
        ResidenceSubmissionService.delete(mockSubjectId)
      ).rejects.toThrow("The subjectId is missing or invalid");
    });
  });
});
