/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { mapUserModel } from "../../utility/mapUserModel.js";
import { UserService } from "../../services/residence-verification/UserService.js";
import { SubjectRepository } from "../../repositories/residence-verification/subjectRepository.js";

// Aggiungi questo mock per risolvere l'errore
vi.mock("../../services/residence-verification/index.js", () => ({
  userService: {},
}));

vi.mock("../../repositories/residence-verification/subjectRepository.js");
vi.mock("../../utility/mapUserModel.js");
vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("UserService", () => {
  const service: UserService = new UserService();
  const mockRepoResult = [{ subjects: { uuid: "uuid1" }, addresses: {} }];
  const mockMappedUser = { uuid: "uuid1", subject: { name: "Test" } };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserBySubjectId", () => {
    it("should return a mapped user when repository finds data", async () => {
      vi.mocked(
        SubjectRepository.prototype.findWithAddressBySubjectId
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await service.getUserBySubjectId("test-id");

      expect(
        SubjectRepository.prototype.findWithAddressBySubjectId
      ).toHaveBeenCalledWith("test-id");
      expect(mapUserModel).toHaveBeenCalledWith(
        mockRepoResult[0].subjects.uuid,
        mockRepoResult[0].subjects,
        mockRepoResult[0].addresses
      );
      expect(result).toEqual(mockMappedUser);
    });

    it("should return null if repository finds no data", async () => {
      vi.mocked(
        SubjectRepository.prototype.findWithAddressBySubjectId
      ).mockResolvedValue([]);

      const result = await service.getUserBySubjectId("not-found-id");

      expect(result).toBeNull();
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });

  describe("getByPersonalInfo", () => {
    it("should return an array of mapped users", async () => {
      vi.mocked(
        SubjectRepository.prototype.findWithAddressByPersonalInfo
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await service.getByPersonalInfo({ name: "Test" });

      expect(result).toEqual([mockMappedUser]);
      expect(mapUserModel).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if repository finds nothing", async () => {
      vi.mocked(
        SubjectRepository.prototype.findWithAddressByPersonalInfo
      ).mockResolvedValue([]);

      const result = await service.getByPersonalInfo({ name: "not-found" });

      expect(result).toEqual([]);
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });
});
