import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockInsert,
  mockValues,
  mockOnConflictDoUpdate,
  mockSelect,
  mockFrom,
  mockWhere,
  mockLimit,
  mockDelete,
} = vi.hoisted(() => ({
  mockInsert: vi.fn().mockReturnThis(),
  mockValues: vi.fn().mockReturnThis(),
  mockOnConflictDoUpdate: vi.fn().mockReturnThis(),
  mockSelect: vi.fn().mockReturnThis(),
  mockFrom: vi.fn().mockReturnThis(),
  mockWhere: vi.fn().mockReturnThis(),
  mockLimit: vi.fn().mockReturnThis(),
  mockDelete: vi.fn().mockReturnThis(),
}));

vi.mock("../../src/db/postgres/client.js", () => ({
  client: {
    insert: mockInsert,
    values: mockValues,
    onConflictDoUpdate: mockOnConflictDoUpdate,
    select: mockSelect,
    from: mockFrom,
    where: mockWhere,
    limit: mockLimit,
    delete: mockDelete,
  },
}));

vi.mock("../../src/db/schema/piva-verification/piva.model.js", () => ({
  pivaTable: { table: "piva" },
}));

import { PivaRepository } from "../../src/repositories/piva-verification/piva.js";
import { pivaTable } from "../../src/db/schema/piva-verification/piva.model.js";

describe("PivaRepository", () => {
  const organizationId = "12345678901";
  const pivaModel = { organizationId };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call insert and onConflictDoUpdate", async () => {
    mockOnConflictDoUpdate.mockResolvedValueOnce({});
    await PivaRepository.setPivaObject(organizationId);

    expect(mockInsert).toHaveBeenCalledWith(pivaTable);
    expect(mockValues).toHaveBeenCalledWith({ organizationId });
  });

  it("should return the model if found", async () => {
    mockLimit.mockResolvedValueOnce([pivaModel]);
    const result = await PivaRepository.getPivaObjectByKey(organizationId);

    expect(mockLimit).toHaveBeenCalledWith(1);
    expect(result).toEqual(pivaModel);
  });

  it("should return null if not found", async () => {
    mockLimit.mockResolvedValueOnce([]);
    const result = await PivaRepository.getPivaObjectByKey(organizationId);
    expect(result).toBeNull();
  });

  it("should return a list of objects", async () => {
    const pivaList = [pivaModel];
    mockFrom.mockResolvedValueOnce(pivaList);
    const result = await PivaRepository.getAllPivaObject();

    expect(mockFrom).toHaveBeenCalledWith(pivaTable);
    expect(result).toEqual(pivaList);
  });

  it("should call delete with the where clause", async () => {
    mockWhere.mockResolvedValueOnce(undefined);
    await PivaRepository.deletePivaObjectByKey(organizationId);

    expect(mockDelete).toHaveBeenCalledWith(pivaTable);
    expect(mockWhere).toHaveBeenCalled();
  });

  it("should call delete without the where clause", async () => {
    mockDelete.mockResolvedValueOnce(undefined);
    await PivaRepository.deleteAllPivaObject();

    expect(mockDelete).toHaveBeenCalledWith(pivaTable);
    expect(mockWhere).not.toHaveBeenCalled();
  });
});
