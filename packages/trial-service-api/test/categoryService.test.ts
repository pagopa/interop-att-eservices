import { describe, it, expect, vi, beforeEach } from "vitest";
import { client, logger } from "pdnd-common";
import { categoryToCategoryResponse } from "../src/model/domain/apiConverter.js";
import categoryService from "../src/services/categoryService.js";

// Definiamo un oggetto per la catena di mock, rendendo il test più robusto
const mockSelectChain = {
  from: vi.fn(),
};

// Mock del modulo pdnd-common
vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
  client: {
    // CORREZIONE 1: `select()` ora restituisce il nostro oggetto mock `mockSelectChain`
    select: vi.fn(() => mockSelectChain),
  },
  Category: {}, // Mock della tabella
}));

// Mock del modulo converter
vi.mock("../src/model/domain/apiConverter.js", () => ({
  categoryToCategoryResponse: vi.fn(),
}));

describe("CategoryService", () => {
  beforeEach(() => {
    // Pulisce tutti i mock per garantire l'isolamento tra i test
    vi.clearAllMocks();
  });

  it("should retrieve all categories and map them to responses", async () => {
    // 1. Arrange
    // CORREZIONE 2: Utilizziamo `number` per la proprietà `id`
    const mockRawCategories = [{ id: 1, description: "Category 1" }];
    const mockResponseCategories = [{ id: 1, name: "Category 1 Mapped" }];

    // Simula la risposta del database sulla catena corretta
    vi.mocked(mockSelectChain.from).mockResolvedValue(mockRawCategories);

    // Simula la funzione di conversione
    vi.mocked(categoryToCategoryResponse).mockReturnValue(
      mockResponseCategories[0]
    );

    // 2. Act
    const result = await categoryService.getAll();

    // 3. Assert
    expect(result).toEqual(mockResponseCategories);
    expect(client.select).toHaveBeenCalled();
    // Verifica la chiamata sul metodo `from` della nostra catena mockata
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
    // 1. Arrange
    const error = new Error("DB Error");
    // Simula il fallimento sulla catena corretta
    vi.mocked(mockSelectChain.from).mockRejectedValue(error);

    // 2. Act & 3. Assert
    await expect(categoryService.getAll()).rejects.toThrow(error);

    expect(logger.error).toHaveBeenCalledWith(
      `CategoryService - getAll - Generic error: ${error}`
    );
    expect(logger.info).not.toHaveBeenCalled();
  });
});
