import { describe, it, expect, vi, beforeEach } from "vitest";
import healtRepository from "../src/repository/healtRepository";
import { db } from "../src/model/db/index.js";

vi.mock("../src/model/db/index.js", () => ({
  db: {
    execute: vi.fn(),
  },
}));

describe("healtRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when database connection is successful", async () => {
    (db.execute as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const result = await healtRepository.checkConnection();

    expect(db.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toBe(true);
  });

  it("should return false when database connection fails", async () => {
    (db.execute as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("DB connection failed")
    );

    const result = await healtRepository.checkConnection();

    expect(db.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toBe(false);
  });
});
