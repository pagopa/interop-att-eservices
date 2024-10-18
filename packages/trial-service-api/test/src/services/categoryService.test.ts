import { describe, it, expect, vi, beforeEach } from "vitest";
import { Category } from "trial";

vi.mock("../../../src/utilities/jsonTrialUtilities", () => ({
  parseJsonToCategoryArray: vi.fn(),
}));

vi.mock("trial", () => {
  return {
    Category: {
      findAll: vi.fn(),
    },
  };
});

describe("categoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findAllCategory", () => {
    it("should find all Categories in database", async () => {
      const mockParsedData = [
        {
          id: 1,
          code: "agid-token",
          eservice: "test-verification",
          description: "token",
          order: 1,
        },
        {
          id: 2,
          code: "cert",
          eservice: "test-verification,test-2-verification,test-3-verification",
          description: "Verify certificate validity",
          order: 2,
        },
        {
          id: 3,
          code: "e-service",
          eservice: "test-verification,test-2-verification,test-3-verification",
          description: "e-service exposed by the application",
          order: 4,
        },
      ];

      (Category.findAll as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockParsedData
      );

      const result = await Category.findAll();

      expect(Category.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockParsedData);
    });
  });
});
