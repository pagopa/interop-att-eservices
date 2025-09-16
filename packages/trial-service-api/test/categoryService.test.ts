import { describe, it, expect, vi, beforeEach } from "vitest";
import { client, logger } from "pdnd-common";
import { categoryToCategoryResponse } from "../src/model/domain/apiConverter.js";
import categoryService from "../src/services/categoryService.js";

const mockSelectChain = {
  from: vi.fn(),
};

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  client: {
    select: vi.fn(() => mockSelectChain),
  },
  Category: {},
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  categoryToCategoryResponse: vi.fn(),
}));

describe("CategoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all categories and map them to responses", async () => {
    const mockRawCategories = [{ id: 1, description: "Category 1" }];
    const mockResponseCategories = [{ id: 1, name: "Category 1 Mapped" }];

    vi.mocked(mockSelectChain.from).mockResolvedValue(mockRawCategories);

    vi.mocked(categoryToCategoryResponse).mockReturnValue(
      mockResponseCategories[0]
    );

    const result = await categoryService.getAll();

    expect(result).toEqual(mockResponseCategories);
    expect(client.select).toHaveBeenCalled();
    expect(mockSelectChain.from).toHaveBeenCalled();
    expect(categoryToCategoryResponse).toHaveBeenCalledWith(
      mockRawCategories[0],
      0,
      mockRawCategories
    );
    expect(logger.info).toHaveBeenCalledWith(
      "CategoryService - getAll - All categories retrieved successfully"
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should throw an error and log it when the database call fails", async () => {
    const error = new Error("DB Error");
    vi.mocked(mockSelectChain.from).mockRejectedValue(error);

    await expect(categoryService.getAll()).rejects.toThrow(error);

    expect(logger.error).toHaveBeenCalledWith(
      `CategoryService - getAll - Generic error: ${error}`
    );
    expect(logger.info).not.toHaveBeenCalled();
  });
});
