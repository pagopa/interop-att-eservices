// AGGIUNTA: Importa 'Mock' da vitest
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { logger } from "pdnd-common";
import checkService from "../src/services/checkService.js";
import { CheckRepository } from "../src/repository/checkRepository.js";
import { checkToCheckResponse } from "../src/model/domain/apiConverter.js";

vi.mock("../src/repository/checkRepository.js", () => ({
  CheckRepository: {
    findAllChecksWithCategories: vi.fn(),
  },
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  checkToCheckResponse: vi.fn((c) => ({ ...c, mapped: true })),
}));

vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("CheckService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all checks from repository and map them", async () => {
    const mockChecksFromRepo = [
      { id: 1, description: "Check One" },
      { id: 2, description: "Check Two" },
    ];

    // CORREZIONE: Aggiunto il cast "(... as Mock)" per TypeScript
    (CheckRepository.findAllChecksWithCategories as Mock).mockResolvedValue(
      mockChecksFromRepo
    );

    // ... resto del test ...
    const expectedResponse = [
      { id: 1, description: "Check One", mapped: true },
      { id: 2, description: "Check Two", mapped: true },
    ];

    const result = await checkService.getAll();

    expect(result).toEqual(expectedResponse);
    expect(CheckRepository.findAllChecksWithCategories).toHaveBeenCalledOnce();
    expect(checkToCheckResponse).toHaveBeenCalledTimes(2);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should throw an error and log it if repository fails", async () => {
    const error = new Error("Repository Error");

    // CORREZIONE: Aggiunto il cast "(... as Mock)" per TypeScript
    (CheckRepository.findAllChecksWithCategories as Mock).mockRejectedValue(
      error
    );

    await expect(checkService.getAll()).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(
      `CheckService - getAll - generic error: ${error}`
    );
  });
});
