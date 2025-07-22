import { describe, it, expect, vi, afterEach } from "vitest";
import { eq } from "drizzle-orm";
import { FiscalcodeModel } from "pdnd-models";
import { FiscalCodeRepository } from "../../src/repositories/fiscal-code-verification/fiscalCodeRepository.js";
import { fiscalCodes } from "../../src/db/schema/fiscal-code-verification/index.js";

const {
  mockClient,
  mockLogger,
  mockWhere,
  mockLimit,
  mockReturning,
  mockValues,
  mockOnConflictDoUpdate,
} = vi.hoisted(() => {
  const mockWhere = vi.fn();
  const mockLimit = vi.fn();
  const mockReturning = vi.fn();
  const mockValues = vi.fn();
  const mockOnConflictDoUpdate = vi.fn();

  // Questo oggetto simula la catena di metodi di Drizzle.
  const dbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: mockWhere,
    limit: mockLimit,
    insert: vi.fn().mockReturnThis(),
    values: mockValues,
    onConflictDoUpdate: mockOnConflictDoUpdate,
    returning: mockReturning,
    delete: vi.fn().mockReturnThis(),
  };

  // Impostiamo il comportamento di default della catena per restituire se stessa.
  mockWhere.mockReturnValue(dbChain);
  mockValues.mockReturnValue(dbChain);
  mockOnConflictDoUpdate.mockReturnValue(dbChain);

  return {
    mockClient: {
      select: vi.fn(() => dbChain),
      insert: vi.fn(() => dbChain),
      delete: vi.fn(() => dbChain),
    },
    mockLogger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    mockWhere,
    mockLimit,
    mockReturning,
    mockValues,
    mockOnConflictDoUpdate,
  };
});
vi.mock("../../src/index.js", () => ({
  client: mockClient,
  logger: mockLogger,
}));

describe("FiscalCodeRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findByFiscalCode", () => {
    it("should return a fiscal code if found", async () => {
      const mockFiscalCode = { fiscalCode: "RSSMRA80A01H501A" };
      // Definiamo cosa deve restituire la fine della catena di query.
      mockLimit.mockResolvedValueOnce([mockFiscalCode]);

      const result = await FiscalCodeRepository.findByFiscalCode(
        "RSSMRA80A01H501A"
      );

      expect(mockClient.select).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith(
        eq(fiscalCodes.fiscalCode, "RSSMRA80A01H501A")
      );
      expect(result).toEqual(mockFiscalCode);
    });

    it("should return null if fiscal code is not found", async () => {
      mockLimit.mockResolvedValueOnce([]);

      const result = await FiscalCodeRepository.findByFiscalCode("NOTFOUND");
      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("should insert or update a fiscal code and return it", async () => {
      const modelToSave: FiscalcodeModel = { fiscalCode: "RSSMRA80A01H501A" };
      mockReturning.mockResolvedValueOnce([modelToSave]);

      const result = await FiscalCodeRepository.save(modelToSave);

      expect(mockClient.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(modelToSave);
      expect(mockOnConflictDoUpdate).toHaveBeenCalled();
      expect(result).toEqual(modelToSave);
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });

  describe("deleteAll", () => {
    it("should delete all records and return the count", async () => {
      const mockDeleted = [{ deletedId: 1 }, { deletedId: 2 }];
      mockReturning.mockResolvedValueOnce(mockDeleted);

      const result = await FiscalCodeRepository.deleteAll();

      expect(mockClient.delete).toHaveBeenCalled();
      expect(result).toBe(2);
      expect(mockLogger.info).toHaveBeenCalledWith(
        "FiscalCodeRepository: Cancellati 2 record."
      );
    });
  });

  describe("deleteByFiscalCode", () => {
    it("should delete a specific record and return 1", async () => {
      const fiscalCode = "RSSMRA80A01H501A";
      mockReturning.mockResolvedValueOnce([{ deletedId: 1 }]);

      const result = await FiscalCodeRepository.deleteByFiscalCode(fiscalCode);

      expect(mockClient.delete).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith(
        eq(fiscalCodes.fiscalCode, fiscalCode)
      );
      expect(result).toBe(1);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it("should return 0 if no record was deleted", async () => {
      mockReturning.mockResolvedValueOnce([]);

      const result = await FiscalCodeRepository.deleteByFiscalCode("NOTFOUND");

      expect(result).toBe(0);
      // Verifichiamo che il logger non venga chiamato se non si cancella nulla.
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});
