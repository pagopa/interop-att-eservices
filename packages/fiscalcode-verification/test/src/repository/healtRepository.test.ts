import { describe, it, expect, vi, beforeEach } from "vitest";
import healtRepository from "../../../src/repository/healtRepository";
import { cacheManager } from "pdnd-common";

// Mock di cacheManager
vi.mock("pdnd-common", () => ({
  cacheManager: {
    checkConnection: vi.fn(),
  },
}));

describe("healtRepository", () => {
  beforeEach(() => {
    // Resetta tutti i mock prima di ogni test
    vi.clearAllMocks();
  });

  it("should call cacheManager.checkConnection and return its result", async () => {
    // Arrange
    const mockResult = true;
    (
      cacheManager.checkConnection as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockResult);

    // Act
    const result = await healtRepository.checkConnection();

    // Assert
    expect(cacheManager.checkConnection).toHaveBeenCalled();
    expect(result).toBe(mockResult);
  });

  it("should return null if cacheManager.checkConnection fails", async () => {
    // Arrange
    (
      cacheManager.checkConnection as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    // Act
    const result = await healtRepository.checkConnection();

    // Assert
    expect(cacheManager.checkConnection).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
