import { describe, it, expect, vi, beforeEach } from "vitest";
import { FamilyStatusService, mapDbRecordToResponseFS001 } from "pdnd-common";
import controller from "../src/controllers/FamilyStatusController.js";
import { RequestFS001 } from "../src/model/domain/models.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  getContext: vi.fn(),
  mapDbRecordToResponseFS001: vi.fn(),
  FamilyStatusService: {
    verifyBySubjectId: vi.fn(),
    findByPersonalInfo: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("../src/exceptions/errors.js", () => ({
  requestParamNotValid: (message: string): Error => new Error(message),
  userModelNotFound: (): Error => new Error("User model not found"),
}));

describe("FamilyStatusController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findUser", () => {
    it("should find a user by subjectId", async (): Promise<void> => {
      const mockRequest: RequestFS001 = {
        operationId: "op123",
        criteria: { subjectId: "SUBJ123" },
      };
      const mockDbRecord = {
        id: "db-record-1",
        name: "Mario",
        surname: "Rossi",
        birthDate: { eventDate: "1980-01-01" },
      };
      const mockFinalResponse = { idOp: "op123", subjects: { subject: [] } };

      vi.mocked(FamilyStatusService.verifyBySubjectId).mockResolvedValue(
        mockDbRecord
      );
      vi.mocked(mapDbRecordToResponseFS001).mockReturnValue(mockFinalResponse);

      const result = await controller.findUser(mockRequest);

      expect(FamilyStatusService.verifyBySubjectId).toHaveBeenCalledWith(
        "SUBJ123"
      );
      expect(mapDbRecordToResponseFS001).toHaveBeenCalledWith(
        mockDbRecord,
        "op123"
      );
      expect(result).toEqual(mockFinalResponse);
    });

    it("should find a user by personal info", async (): Promise<void> => {
      const mockRequest: RequestFS001 = {
        operationId: "op456",
        criteria: {
          name: "Mario",
          surname: "Rossi",
          birthDate: {
            eventDate: "1980-01-01",
            birthPlace: {},
            placeOfBirth: {
              municipality: { nameMunicipality: "Roma" },
              place: { codState: "IT" },
            },
          },
        },
      };
      const mockDbRecordArray = [
        {
          id: "db-record-2",
          name: "Mario",
          surname: "Rossi",
          birthDate: { eventDate: "1980-01-01" },
        },
      ];
      const mockFinalResponse = { idOp: "op456", subjects: { subject: [] } };

      vi.mocked(FamilyStatusService.findByPersonalInfo).mockResolvedValue(
        mockDbRecordArray
      );
      vi.mocked(mapDbRecordToResponseFS001).mockReturnValue(mockFinalResponse);

      const result = await controller.findUser(mockRequest);

      expect(FamilyStatusService.findByPersonalInfo).toHaveBeenCalledWith(
        mockRequest.criteria
      );
      expect(mapDbRecordToResponseFS001).toHaveBeenCalledWith(
        mockDbRecordArray[0],
        "op456"
      );
      expect(result).toEqual(mockFinalResponse);
    });

    it("should throw an error for invalid request params", async (): Promise<void> => {
      const mockRequest: RequestFS001 = { operationId: "op789", criteria: {} };
      await expect(controller.findUser(mockRequest)).rejects.toThrow(
        "The request body has one or more required param not valid"
      );
    });
  });

  describe("findUserVerify", () => {
    it("should return success if user data is valid", async (): Promise<void> => {
      const mockRequest: RequestFS001 = {
        operationId: "op-verify-1",
        criteria: { id: "ID-OK" },
      };
      const mockDbRecord = {
        id: "db-record-3",
        subjects: { subject: [{ id: "user-1" }, { id: "user-2" }] },
      };
      const mockConverterResponse = {
        subjects: { subject: [{ id: "user-1" }] },
      };

      vi.mocked(FamilyStatusService.findById).mockResolvedValue(mockDbRecord);
      vi.mocked(mapDbRecordToResponseFS001).mockReturnValue(
        mockConverterResponse
      );

      const result = await controller.findUserVerify(mockRequest);

      expect(result).toEqual({ idOp: "op-verify-1" });
    });

    it("should throw userModelNotFound if data has no subjects", async (): Promise<void> => {
      const mockRequest: RequestFS001 = {
        operationId: "op-verify-2",
        criteria: { id: "ID-EMPTY" },
      };
      const mockDbRecord = {
        id: "db-record-4",
        uuid: "uuid-4",
        subjectId: "subject-4",
        surname: "Doe",
        name: "John",
        birthDate: { eventDate: "1990-01-01" },
        gender: "M",
        citizenship: "IT",
        familyStatus: "single",
        residence: {},
        registryStatus: "active",
        registryStatusDate: "2023-01-01",
        registryStatusReason: "reason",
        registryStatusPlace: "place",
        registryStatusAuthority: "authority",
        registryStatusProtocol: "protocol",
        registryStatusProtocolDate: "2023-01-01",
        registryStatusProtocolAuthority: "protocol-authority",
        registryStatusProtocolPlace: "protocol-place",
        registryStatusProtocolReason: "protocol-reason",
        registryStatusProtocolType: "protocol-type",
        registryStatusProtocolNote: "protocol-note",
        registryStatusProtocolNoteDate: "2023-01-01",
      };
      const mockConverterResponse = { subjects: { subject: [] } };

      vi.mocked(FamilyStatusService.findById).mockResolvedValue(mockDbRecord);
      vi.mocked(mapDbRecordToResponseFS001).mockReturnValue(
        mockConverterResponse
      );

      await expect(controller.findUserVerify(mockRequest)).rejects.toThrow(
        "User model not found"
      );
    });
  });
});
