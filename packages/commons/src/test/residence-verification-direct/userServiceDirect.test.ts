/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { UserServiceDirect } from "../../services/residence-verification-direct/userServiceDirect.js";
import { mapUserModel } from "../../utility/mapUserModel.js";
import { SubjectRepositoryDirect } from "../../repositories/residence-verification-direct/subjectRepository.js";

vi.mock(
  "../../repositories/residence-verification-direct/subjectRepository.js"
);
vi.mock("../../utility/mapUserModel.js");
vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("UserServiceDirect", () => {
  const service: UserServiceDirect = new UserServiceDirect();
  const mockRepoResult = [{ subjects: { uuid: "uuid1" }, addresses: {} }];
  const mockMappedUser = { uuid: "uuid1", subject: { name: "Test" } };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserBySubjectId", () => {
    it("should return a mapped user when repository finds data", async () => {
      vi.mocked(
        SubjectRepositoryDirect.prototype.findWithAddressBySubjectId
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await service.getUserBySubjectId("test-id");

      expect(
        SubjectRepositoryDirect.prototype.findWithAddressBySubjectId
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
        SubjectRepositoryDirect.prototype.findWithAddressBySubjectId
      ).mockResolvedValue([]);

      const result = await service.getUserBySubjectId("not-found-id");

      expect(result).toBeNull();
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });

  describe("getByPersonalInfo", () => {
    it("should return an array of mapped users", async () => {
      vi.mocked(
        SubjectRepositoryDirect.prototype.findWithAddressByPersonalInfo
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await service.getByPersonalInfo({ name: "Test" });

      expect(result).toEqual([mockMappedUser]);
      expect(mapUserModel).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if repository finds nothing", async () => {
      vi.mocked(
        SubjectRepositoryDirect.prototype.findWithAddressByPersonalInfo
      ).mockResolvedValue([]);

      const result = await service.getByPersonalInfo({ name: "not-found" });

      expect(result).toEqual([]);
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });
});
