/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { userServiceDirect } from "../../src/services/residence-verification-direct/userServiceDirect.js";
import { mapUserModel } from "../../src/utility/mapUserModel.js";
import { SubjectRepositoryDirect } from "../../src/repositories/residence-verification-direct/subjectRepositoryDirect.js";

vi.mock(
  "../../src/repositories/residence-verification-direct/subjectRepositoryDirect.js"
);
vi.mock("../../src/utility/mapUserModel.js");
vi.mock("../../src/index.js", () => {
  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    execute: vi.fn(),
  };

  return {
    logger: {
      error: vi.fn(),
    },
    client: {
      select: vi.fn(() => mockDbChain),
    },
  };
});

describe("UserServiceDirect", () => {
  const mockRepoResult = [{ subjects: { uuid: "uuid1" }, addresses: {} }];
  const mockMappedUser = { uuid: "uuid1", subject: { name: "Test" } };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserBySubjectId", () => {
    it("should return a mapped user when repository finds data", async () => {
      vi.mocked(
        SubjectRepositoryDirect.findWithAddressBySubjectId
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await userServiceDirect.getUserBySubjectId("test-id");

      expect(
        SubjectRepositoryDirect.findWithAddressBySubjectId
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
        SubjectRepositoryDirect.findWithAddressBySubjectId
      ).mockResolvedValue([]);

      const result = await userServiceDirect.getUserBySubjectId("not-found-id");

      expect(result).toBeNull();
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });

  describe("getByPersonalInfo", () => {
    it("should return an array of mapped users", async () => {
      vi.mocked(
        SubjectRepositoryDirect.findWithAddressByPersonalInfo
      ).mockResolvedValue(mockRepoResult as any);
      vi.mocked(mapUserModel).mockResolvedValue(mockMappedUser as any);

      const result = await userServiceDirect.getByPersonalInfo({
        name: "Test",
      });

      expect(result).toEqual([mockMappedUser]);
      expect(mapUserModel).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if repository finds nothing", async () => {
      vi.mocked(
        SubjectRepositoryDirect.findWithAddressByPersonalInfo
      ).mockResolvedValue([]);

      const result = await userServiceDirect.getByPersonalInfo({
        name: "not-found",
      });

      expect(result).toEqual([]);
      expect(mapUserModel).not.toHaveBeenCalled();
    });
  });
});
