import { describe, it, expect, vi, afterEach } from "vitest";
import {
  subjectTable,
  addressTable,
} from "../../db/schema/residence-verification/index.js";
import { SubjectRepository } from "../../repositories/residence-verification/index.js";

const { mockClient, mockFrom, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    execute: vi.fn(),
  };

  const mockFrom = vi.fn().mockReturnValue(mockDbChain);

  const mockClient = {
    select: vi.fn(() => ({
      from: mockFrom,
    })),
  };
  return { mockClient, mockFrom, mockDbChain };
});

vi.mock("pdnd-common", () => ({ client: mockClient }));

describe("SubjectRepository", () => {
  const repository: SubjectRepository = new SubjectRepository();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findWithAddressBySubjectId", () => {
    it("should call the full drizzle chain including from(subjectTable)", async () => {
      const mockResult = [{ subjects: {}, addresses: {} }];
      vi.mocked(mockDbChain.execute).mockResolvedValue(mockResult);

      await repository.findWithAddressBySubjectId("SUBJ123");

      expect(mockClient.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(subjectTable);
      expect(mockDbChain.innerJoin).toHaveBeenCalledWith(
        addressTable,
        expect.anything()
      );
      expect(mockDbChain.where).toHaveBeenCalled();
      expect(mockDbChain.limit).toHaveBeenCalledWith(1);
      expect(mockDbChain.execute).toHaveBeenCalled();
    });
  });

  describe("findWithAddressByPersonalInfo", () => {
    it("should return an empty array and not call the db if no search parameters are provided", async () => {
      const result = await repository.findWithAddressByPersonalInfo({});

      expect(result).toEqual([]);
      expect(mockClient.select).not.toHaveBeenCalled();
    });
  });
});
