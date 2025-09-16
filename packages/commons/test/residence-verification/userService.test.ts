/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { mapUserModel } from "../../src/utility/mapUserModel.js";
import { userService } from "../../src/services/residence-verification/UserService.js";
import { SubjectRepository } from "../../src/repositories/residence-verification/subjectRepository.js";

vi.mock("../../src/repositories/residence-verification/subjectRepository.js");
vi.mock("../../src/utility/mapUserModel.js");
vi.mock("../../src/index.js", () => ({
  logger: { error: vi.fn() },
}));

describe("UserService", () => {
  const mockRepoResult = [{ subjects: { uuid: "uuid1" }, addresses: {} }];
  const mockMappedUser = { uuid: "uuid1", subject: { name: "Test" } };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserBySubjectId", () => {
    it("should return a mapped user when repository finds data", async () => {
      vi.mocked(SubjectRepository.findWithAddressBySubjectId).mockResolvedValue(
        mockRepoResult as any
      );
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await userService.getUserBySubjectId("test-id");

      expect(SubjectRepository.findWithAddressBySubjectId).toHaveBeenCalledWith(
        "test-id"
      );
      expect(mapUserModel).toHaveBeenCalledWith(
        mockRepoResult[0].subjects.uuid,
        mockRepoResult[0].subjects,
        mockRepoResult[0].addresses
      );
      expect(result).toEqual(mockMappedUser);
    });

    it("should return null if repository finds no data", async () => {
      vi.mocked(SubjectRepository.findWithAddressBySubjectId).mockResolvedValue(
        []
      );

      const result = await userService.getUserBySubjectId("not-found-id");

      expect(result).toBeNull();
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });

  describe("getByPersonalInfo", () => {
    it("should return an array of mapped users", async () => {
      vi.mocked(
        SubjectRepository.findWithAddressByPersonalInfo
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await userService.getByPersonalInfo({ name: "Test" });

      expect(result).toEqual([mockMappedUser]);
      expect(mapUserModel).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if repository finds nothing", async () => {
      vi.mocked(
        SubjectRepository.findWithAddressByPersonalInfo
      ).mockResolvedValue([]);

      const result = await userService.getByPersonalInfo({ name: "not-found" });

      expect(result).toEqual([]);
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });
});
