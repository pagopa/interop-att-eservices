/* eslint-disable functional/no-let */
import { describe, it, expect, vi, afterEach } from "vitest";
import { DataPreparationRepository } from "../../src/repositories/digital-address-verification/dataPreparationRepository.js";

const { mockClient, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    set: vi.fn().mockReturnThis(),
    then: vi.fn(),
  };
  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
    select: vi.fn().mockReturnValue(mockDbChain),
    delete: vi.fn().mockReturnValue(mockDbChain),
    update: vi.fn().mockReturnValue(mockDbChain),
  };
  return { mockClient, mockDbChain };
});

vi.mock("../../src/index.js", () => ({
  client: mockClient,
  logger: { error: vi.fn() },
}));

describe("DataPreparationRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should upsert data preparation", async () => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await DataPreparationRepository.upsertDataPreparation("TEST_SUBJECT_01");
    expect(mockClient.insert).toHaveBeenCalled();
    expect(mockDbChain.onConflictDoUpdate).toHaveBeenCalled();
  });

  it("should find all aggregated data", async () => {
    const mockData = [{ idSubject: "SUBJ1" }];
    vi.mocked(mockDbChain.orderBy).mockResolvedValue(mockData);
    const result = await DataPreparationRepository.findAllAggregatedData();
    expect(mockClient.select).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("should delete all data", async () => {
    const mockResult = { rowCount: 5 };
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(mockResult)
    );
    const result = await DataPreparationRepository.deleteAll();
    expect(mockClient.delete).toHaveBeenCalled();
    expect(result).toBe(5);
  });
});
