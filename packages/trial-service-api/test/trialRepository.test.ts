import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrialRepository } from "../src/repository/trialRepository.js";

const mockSelectChain = {
  from: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn(),
};

vi.mock("pdnd-common", () => ({
  client: {
    select: vi.fn(() => mockSelectChain),
  },
  Trial: {},
  Check: {},
  Category: {},
  eq: vi.fn((a, b) => `eq(${a}, ${b})`),
}));

vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return {
    ...actual,
    and: vi.fn((...args) => `and(${args.join(", ")})`),
    asc: vi.fn((col) => `asc(${col})`),
  };
});

describe("TrialRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle trials with null or missing check data", async () => {
    const mockDbResponse = [
      {
        id: "trial-id-3",
        purpose_id: "purpose-789",
        correlation_id: "corr-ABC",
        operation_path: "/test/3",
        operation_method: null,
        response: null,
        created_date: new Date("2025-08-01T13:00:00Z"),
        check_id: null,
        check_code: null,
        check_description: null,
        check_order: null,
        category_id: null,
      },
    ];
    mockSelectChain.offset.mockResolvedValue(mockDbResponse);

    const result = await TrialRepository.findPaginatedTrial(
      1,
      5,
      "purpose-789"
    );

    const group = result.data?.[0];
    const trial = group?.trials?.[0];

    if (trial) {
      expect(trial.operation_method).toBeUndefined();
      expect(trial.response).toBeUndefined();
      expect(trial.checks).toEqual([]);
    } else {
      throw new Error("Test failed: trial object was not defined as expected.");
    }
  });

  it("should return an empty response when no trials are found", async () => {
    mockSelectChain.offset.mockResolvedValue([]);

    const result = await TrialRepository.findPaginatedTrial(
      1,
      10,
      "non-existent-purpose"
    );

    expect(result.data).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
  });
});
