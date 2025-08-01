// AGGIUNTA: Importa 'Mock'
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import trialService from "../src/services/trialService.js";
import { TrialRepository } from "../src/repository/trialRepository.js";
// AGGIUNTA: Importa il tipo di risposta per evitare 'any'
import { PaginatedTrialResponse } from "../src/model/domain/models.js";

vi.mock("../src/repository/trialRepository.js", () => ({
  TrialRepository: {
    findPaginatedTrial: vi.fn(),
  },
}));

vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("TrialService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call the repository with the correct parameters and return its response", async () => {
    // CORREZIONE: Usiamo il tipo importato invece di 'any'
    const mockResponse: PaginatedTrialResponse = {
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      data: [{ purpose_id: "purpose-123", correlation_id: "c1", trials: [] }], // Adattato per matchare il tipo
    };

    // CORREZIONE: Aggiunto il cast "(... as Mock)"
    (TrialRepository.findPaginatedTrial as Mock).mockResolvedValue(
      mockResponse
    );

    // ... resto del test ...
    const args = {
      page: 1,
      pageSize: 10,
      purposeId: "purpose-123",
      correlationId: "corr-456",
      path: "/test",
      method: "GET",
    };

    const result = await trialService.getPaginatedTrial(
      args.page,
      args.pageSize,
      args.purposeId,
      args.correlationId,
      args.path,
      args.method // CORREZIONE: Aggiunta virgola per Prettier
    );

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error and log it if the repository fails", async () => {
    const error = new Error("Repository findPaginatedTrial Error");

    // CORREZIONE: Aggiunto il cast "(... as Mock)"
    (TrialRepository.findPaginatedTrial as Mock).mockRejectedValue(error);

    await expect(trialService.getPaginatedTrial(1, 10, "p1")).rejects.toThrow(
      error
    );
  });
});
