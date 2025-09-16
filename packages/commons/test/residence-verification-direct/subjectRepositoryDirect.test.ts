import { describe, it, expect, vi, afterEach } from "vitest";
import { subjectTable } from "../../src/db/schema/residence-verification/index.js";
import { SubjectRepositoryDirect } from "../../src/repositories/residence-verification-direct/index.js";

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

vi.mock("../../src/index.js", () => ({ client: mockClient }));

describe("SubjectRepositoryDirect", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("findWithAddressBySubjectId should build and execute the correct query", async () => {
    vi.mocked(mockDbChain.execute).mockResolvedValue([]);
    await SubjectRepositoryDirect.findWithAddressBySubjectId("test-id");

    expect(mockClient.select).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(subjectTable);
    expect(mockDbChain.where).toHaveBeenCalled();
    expect(mockDbChain.limit).toHaveBeenCalledWith(1);
    expect(mockDbChain.execute).toHaveBeenCalled();
  });

  it("findWithAddressByPersonalInfo should build and execute query when params are provided", async () => {
    vi.mocked(mockDbChain.execute).mockResolvedValue([]);
    await SubjectRepositoryDirect.findWithAddressByPersonalInfo({
      name: "Test",
    });

    expect(mockClient.select).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(subjectTable);
    expect(mockDbChain.where).toHaveBeenCalled();
    expect(mockDbChain.execute).toHaveBeenCalled();
  });

  it("findWithAddressByPersonalInfo should return empty array if no params are provided", async () => {
    const result = await SubjectRepositoryDirect.findWithAddressByPersonalInfo(
      {}
    );

    expect(result).toEqual([]);
    expect(mockClient.select).not.toHaveBeenCalled();
  });
});
