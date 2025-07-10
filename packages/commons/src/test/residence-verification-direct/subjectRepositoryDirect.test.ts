import { describe, it, expect, vi, afterEach } from "vitest";
import { subjectTable } from "../../db/schema/residence-verification/index.js";
import { SubjectRepositoryDirect } from "../../repositories/residence-verification-direct/subjectRepository.js";

const { mockClient, mockFrom, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    execute: vi.fn(),
  };
  const mockFrom = vi.fn().mockReturnValue(mockDbChain);
  const mockClient = {
    select: vi.fn(() => ({ from: mockFrom })),
  };
  return { mockClient, mockFrom, mockDbChain };
});

vi.mock("pdnd-common", () => ({ client: mockClient }));

describe("SubjectRepositoryDirect", () => {
  const repository: SubjectRepositoryDirect = new SubjectRepositoryDirect();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("findWithAddressBySubjectId should build and execute the correct query", async () => {
    vi.mocked(mockDbChain.execute).mockResolvedValue([]);
    await repository.findWithAddressBySubjectId("test-id");

    expect(mockClient.select).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(subjectTable);
    expect(mockDbChain.where).toHaveBeenCalled();
    expect(mockDbChain.limit).toHaveBeenCalledWith(1);
    expect(mockDbChain.execute).toHaveBeenCalled();
  });

  it("findWithAddressByPersonalInfo should build and execute query when params are provided", async () => {
    vi.mocked(mockDbChain.execute).mockResolvedValue([]);
    await repository.findWithAddressByPersonalInfo({ name: "Test" });

    expect(mockClient.select).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(subjectTable);
    expect(mockDbChain.where).toHaveBeenCalled();
    expect(mockDbChain.execute).toHaveBeenCalled();
  });

  it("findWithAddressByPersonalInfo should return empty array if no params are provided", async () => {
    const result = await repository.findWithAddressByPersonalInfo({});

    expect(result).toEqual([]);
    expect(mockClient.select).not.toHaveBeenCalled();
  });
});
