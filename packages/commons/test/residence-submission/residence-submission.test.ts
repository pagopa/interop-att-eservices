/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { DataPreparationRepository } from "../../src/repositories/residence-submission/dataPreparation.js";
import {
  mapApiBodyToDbModels,
  mapApiBodyToDbModelsUpdate,
} from "../../src/utility/mapRequestAr003.js";
import { ResidenceSubmissionService } from "../../src/services/reisdence-submission/index.js";

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
  userModelNotFound: (msg: string): Error => new Error(msg || "User not found"),
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

const mockSubjectId = "RSSMRA80A01H501U";

export const mockSubject = {
  uuid: uuidv4(),
  id: "ID-12345",
  subject_id: mockSubjectId,
  surname: "Rossi",
  name: "Mario",
  gender: "M",
  birth_event_date: "1980-01-01",
  birth_municipality_name: "Roma",
  birth_municipality_istat_code: "H501",
  birth_municipality_acronym_istat_province: "RM",
};

export const mockAddress = {
  id: "123e4667-e89b-12d3-a456-426614174000",
  address_type: "residence",
  note_address: "Indirizzo principale del soggetto",
  address_start_date: "2025-12-10",
  address_municipality_name: "Roma",
  address_municipality_istat_code: "H501",
  toponym_denomination: "Via del Corso",
  civic_number: "123",
  subject_id: mockSubjectId,
};

export const mockRequest = {
  subjects: {
    subject: {
      generality: {
        subjectId: {
          subjectId: mockSubjectId,
          subjectIdValidity: "2025-12-31",
          dataAttributionValidity: "2023-01-15",
        },
        surname: "Rossi",
        name: "Mario",
        gender: "M",
        birthDate: "1980-01-01",
      },
      address: {
        addressType: "residence",
        noteaddress: "Indirizzo principale di residenza",
        address: {
          municipality: {
            nameMunicipality: "Roma",
            istatCode: "H501",
          },
          toponym: {
            toponymDenomination: "Via del Corso",
          },
          civicNumber: {
            civicNumber: "123",
          },
        },
      },
      identifiers: {
        id: "ID-12345",
      },
    },
  },
};

const mockMappedData = {
  subject: { ...mockSubject },
  address: { ...mockAddress },
};

const mockMappedUpdateData = {
  subject: { ...mockSubject },
  address: { ...mockAddress, address_type: "domicile" },
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("ResidenceSubmissionService", () => {
  describe("getBySubjectId", () => {
    it("should return subject when found", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject as any
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
    it("should create subject and address when not exists", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        null
      );
      vi.mocked(mapApiBodyToDbModels).mockReturnValue(mockMappedData as any);

      await ResidenceSubmissionService.create(mockRequest as any);

      expect(mapApiBodyToDbModels).toHaveBeenCalledWith(mockRequest);
      expect(DataPreparationRepository.createSubject).toHaveBeenCalledWith(
        mockSubject
      );
      expect(DataPreparationRepository.createAddress).toHaveBeenCalledWith(
        mockAddress
      );
    });

    it("should throw error if subject already exists", async () => {
      vi.mocked(mapApiBodyToDbModels).mockReturnValue(mockMappedData as any);
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject as any
      );

      await expect(
        ResidenceSubmissionService.create(mockRequest as any)
      ).rejects.toThrow(
        `Subject with subject_id ${mockSubjectId} already exists.`
      );

      expect(mapApiBodyToDbModels).toHaveBeenCalled();
      expect(DataPreparationRepository.createSubject).not.toHaveBeenCalled();
    });

    it("should throw error if subjects.subject data is missing", async () => {
      const invalidRequest = { subjects: {} };

      await expect(
        ResidenceSubmissionService.create(invalidRequest as any)
      ).rejects.toThrow("Missing 'subjects.subject' data in the request.");
      expect(DataPreparationRepository.createSubject).not.toHaveBeenCalled();
    });
  });

  describe("updateBySubjectId", () => {
    it("should update subject and existing address", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject as any
      );
      vi.mocked(mapApiBodyToDbModelsUpdate).mockReturnValue(
        mockMappedUpdateData as any
      );
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([mockAddress as any]);

      await ResidenceSubmissionService.updateBySubjectId(mockRequest as any);

      expect(DataPreparationRepository.findSubjectById).toHaveBeenCalledWith(
        mockSubjectId
      );
      expect(mapApiBodyToDbModelsUpdate).toHaveBeenCalledWith(mockRequest);

      expect(DataPreparationRepository.updateSubjectById).toHaveBeenCalledWith(
        mockSubjectId,
        mockMappedUpdateData.subject
      );

      expect(DataPreparationRepository.updateAddressById).toHaveBeenCalledWith(
        mockSubjectId,
        mockMappedUpdateData.address
      );
    });

    it("should throw error if subjectId is missing in request", async () => {
      const invalidRequest = { subjects: { subject: { generality: {} } } };

      await expect(
        ResidenceSubmissionService.updateBySubjectId(invalidRequest as any)
      ).rejects.toThrow("Subject ID missing in update request");
    });

    it("should skip address update if no existing address found", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject as any
      );
      vi.mocked(mapApiBodyToDbModelsUpdate).mockReturnValue(
        mockMappedUpdateData as any
      );
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([]);

      await ResidenceSubmissionService.updateBySubjectId(mockRequest as any);

      expect(DataPreparationRepository.updateSubjectById).toHaveBeenCalled();
      expect(
        DataPreparationRepository.updateAddressById
      ).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete subject and all associated addresses", async () => {
      vi.mocked(DataPreparationRepository.findSubjectById).mockResolvedValue(
        mockSubject as any
      );
      vi.mocked(
        DataPreparationRepository.findAddressesBySubjectId
      ).mockResolvedValue([mockAddress as any]);

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
