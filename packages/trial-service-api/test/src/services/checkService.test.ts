import { describe, it, expect, vi, beforeEach } from "vitest";
import { Check } from "trial";

vi.mock("trial", () => {
  return {
    Check: {
      findAll: vi.fn(),
    },
  };
});

describe("checkService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findAllCheck", () => {
    it("should find all Checks in database", async () => {
      const mockParsedData = [
        {
          id: 1,
          code: "header_1",
          description: "token not valid",
          order: 1,
          category: {
            id: 1,
            code: "agid-token",
            eservice: "test-verification",
            description: "token",
            order: 1,
          },
        },
        {
          id: 2,
          code: "cert",
          description: "not valid",
          order: 2,
          category: {
            id: 2,
            code: "cert",
            eservice:
              "test-verification,test-2-verification,test-3-verification",
            description: "Verify certificate validity",
            order: 2,
          },
        },
      ];

      (Check.findAll as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockParsedData
      );

      const result = await Check.findAll();

      expect(Check.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockParsedData);
    });
  });
});
