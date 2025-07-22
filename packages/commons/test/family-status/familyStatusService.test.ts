import { describe, it, expect, vi, afterEach } from "vitest";

import { FamilyStatusService, RawPayload } from "../../src/index.js";
import { familyStatusRepo } from "../../src/repositories/family-status/family-status.js";
import { FamilyStatusDto } from "../../src/types/familyStatusDTO.js";
import {
  InsertFamilyStatus,
  insertFamilyStatusSchema,
} from "../../src/zod/family-status/family-status.js";
import { flattenPayload } from "../../src/zod/family-status/flattenPayload.js";

vi.mock("../../src/zod/family-status/flattenPayload.js", () => ({
  flattenPayload: vi.fn(),
}));

vi.mock("../../src/zod/family-status/family-status.js", () => ({
  insertFamilyStatusSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("../../src/repositories/family-status/family-status.js", () => ({
  familyStatusRepo: {
    upsert: vi.fn(),
    findAll: vi.fn(),
    findByUUID: vi.fn(),
    deleteAll: vi.fn(),
    deleteByUUID: vi.fn(),
    findBySubjectId: vi.fn(),
    findById: vi.fn(),
    findByPersonalInfo: vi.fn(),
  },
}));

describe("FamilyStatusService", () => {
  const mockRawPayload: RawPayload = {
    subject: {
      name: "Mario",
      surname: "Rossi",
      gender: "MALE",
      birthDate: { eventDate: "1990-01-01", placeOfBirth: {} },
      id: "",
      subjectId: "",
    },
    subjectLink: { relationshipType: "SPOUSE", startDate: "2020-01-01" },
  };

  const mockFlatPayload: InsertFamilyStatus = {
    subjectId: "subject-123",
    name: "Mario",
    surname: "Rossi",
    id: "",
  };

  const mockFamilyStatusDto: FamilyStatusDto = {
    uuid: "test-uuid-123",
    subject: {
      subjectId: "subject-123",
      id: "id-123",
      surname: "Rossi",
      name: "Mario",
      gender: "MALE",
      birthDate: {
        eventDate: "1990-01-01",
        placeOfBirth: {
          municipality: {
            nameMunicipality: "Roma",
            istatCode: null,
            acronymIstatProvince: null,
            placeDescription: null,
          },
          place: {
            placeDescription: "Roma",
            countryDescription: null,
            codState: null,
            provinceCounty: null,
          },
        },
      },
    },
    subjectLink: {
      relationshipType: "SPOUSE",
      startDate: "2020-01-01",
      relationshipCode: null,
      memberSequence: null,
      startDateRelationship: null,
      endDateRelationship: null,
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("prepareData", () => {
    it("should process, validate, and upsert a valid payload", async () => {
      const mockUpsertResponse = { uuid: "new-uuid" };
      vi.mocked(flattenPayload).mockReturnValue(mockFlatPayload);
      vi.mocked(familyStatusRepo.upsert).mockResolvedValue(mockUpsertResponse);

      const result = await FamilyStatusService.prepareData(mockRawPayload);

      expect(flattenPayload).toHaveBeenCalledWith(mockRawPayload);
      expect(insertFamilyStatusSchema.parse).toHaveBeenCalledWith(
        mockFlatPayload
      );
      expect(familyStatusRepo.upsert).toHaveBeenCalledWith(mockFlatPayload);
      expect(result).toEqual(mockUpsertResponse);
    });

    it("should throw an error if payload validation fails", async () => {
      const validationError = new Error("Validation Failed");

      vi.mocked(flattenPayload).mockReturnValue(mockFlatPayload);
      vi.mocked(insertFamilyStatusSchema.parse).mockImplementation(() => {
        throw validationError;
      });

      await expect(
        FamilyStatusService.prepareData(mockRawPayload)
      ).rejects.toThrow(validationError);

      expect(familyStatusRepo.upsert).not.toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("should call familyStatusRepo.findAll and return its result", async () => {
      const mockResponse = [mockFamilyStatusDto];
      vi.mocked(familyStatusRepo.findAll).mockResolvedValue(mockResponse);

      const result = await FamilyStatusService.getAll();

      expect(familyStatusRepo.findAll).toHaveBeenCalledOnce();
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getByUUID", () => {
    it("should call familyStatusRepo.findByUUID with the correct uuid", async () => {
      const testUuid = "test-uuid-123";
      vi.mocked(familyStatusRepo.findByUUID).mockResolvedValue(
        mockFamilyStatusDto
      );

      const result = await FamilyStatusService.getByUUID(testUuid);

      expect(familyStatusRepo.findByUUID).toHaveBeenCalledWith(testUuid);
      expect(result).toEqual(mockFamilyStatusDto);
    });
  });

  describe("deleteAll", () => {
    it("should call familyStatusRepo.deleteAll", async () => {
      vi.mocked(familyStatusRepo.deleteAll).mockResolvedValue(5);

      const result = await FamilyStatusService.deleteAll();

      expect(familyStatusRepo.deleteAll).toHaveBeenCalledOnce();
      expect(result).toBe(5);
    });
  });
});
