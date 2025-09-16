import { describe, it, expect, vi, beforeEach } from "vitest";
import { client } from "pdnd-common";
import { CheckRepository } from "../src/repository/checkRepository.js";

const mockSelectChain = {
  from: vi.fn().mockReturnThis(),
  leftJoin: vi.fn(),
};

vi.mock("pdnd-common", () => ({
  client: {
    select: vi.fn(() => mockSelectChain),
  },
  Check: {},
  Category: {},
  eq: vi.fn((a, b) => `eq(${a}, ${b})`),
}));

describe("CheckRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all checks with their categories correctly formatted", async () => {
    const mockDbResponse = [
      {
        id: "check-id-1",
        code: "C001",
        description: "First Check",
        order: 1,
        category_id: "cat-id-1",
        category: {
          id: "cat-id-1",
          code: "CAT1",
          description: "First Category",
          order: 1,
          eservice: "eservice-1",
        },
      },
      {
        id: "check-id-2",
        code: "C002",
        description: "Second Check",
        order: 2,
        category_id: "cat-id-1",
        category: {
          id: "cat-id-1",
          code: "CAT1",
          description: "First Category",
          order: 1,
          eservice: "eservice-1",
        },
      },
    ];
    mockSelectChain.leftJoin.mockResolvedValue(mockDbResponse);

    const result = await CheckRepository.findAllChecksWithCategories();

    expect(result).toEqual(mockDbResponse);

    expect(client.select).toHaveBeenCalled();
    expect(mockSelectChain.from).toHaveBeenCalled();
    expect(mockSelectChain.leftJoin).toHaveBeenCalled();
  });

  it("should return an empty array if no checks are found", async () => {
    mockSelectChain.leftJoin.mockResolvedValue([]);
    const result = await CheckRepository.findAllChecksWithCategories();
    expect(result).toEqual([]);
  });
});
