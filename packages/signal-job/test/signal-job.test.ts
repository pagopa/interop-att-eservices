import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("drizzle-orm", () => ({
  sql: vi.fn(),
}));

const mockEserviceIds = ["esv-1", "esv-2", "esv-3"];
const mockSignalCounters = [
  { eserviceId: "esv-1", signalId: 10 },
  { eserviceId: "esv-2", signalId: 5 },
  { eserviceId: "esv-3", signalId: 100 },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(client.select).mockImplementation(() => ({
    from: () => ({
      execute: async () =>
        mockSignalCounters.map((r) => ({ eserviceId: r.eserviceId })),
    }),
  }));
  vi.mocked(client.insert).mockImplementation(() => ({
    values: (values: any) => ({
      onConflictDoUpdate: ({ set }: any) => ({
        returning: () => ({
          execute: async () => {
            const { eserviceId } = values;
            const existing = mockSignalCounters.find(
              (r) => r.eserviceId === eserviceId,
            );
            let newSignalId;
            if (existing) {
              newSignalId = existing.signalId + 1;
              existing.signalId = newSignalId;
            } else {
              newSignalId = 1;
              mockSignalCounters.push({ eserviceId, signalId: newSignalId });
            }
            return [{ newId: newSignalId }];
          },
        }),
      }),
    }),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

import { SHRepository } from "../src/repositories/SHRepository.js";

describe("SHRepository", () => {
  describe("getAllEserviceIds", () => {
    it("should return all eserviceIds from DB", async () => {
      const result = await SHRepository.getAllEserviceIds();
      expect(result).toEqual(mockEserviceIds);
      expect(client.select).toHaveBeenCalledWith(
        expect.objectContaining({ eserviceId: "eservice_id" }),
      );
      expect(client.from).toHaveBeenCalledWith("eservice_id");
      expect(client.execute).toHaveBeenCalledOnce();
    });

    it("should return empty array if DB has no rows", async () => {
      vi.mocked(client.select).mockImplementation(() => ({
        from: () => ({
          execute: async () => [],
        }),
      }));
      const result = await SHRepository.getAllEserviceIds();
      expect(result).toEqual([]);
    });
  });

  describe("ensureAndIncrementSignalId", () => {
    it("should insert new row with signalId=1", async () => {
      const result = await SHRepository.ensureAndIncrementSignalId("esv-new");
      expect(result).toBe(1);
      expect(mockSignalCounters).toContainEqual({
        eserviceId: "esv-new",
        signalId: 1,
      });
    });

    it("should increment existing signalId", async () => {
      const initial = mockSignalCounters.find(
        (r) => r.eserviceId === "esv-1",
      )!.signalId;
      const result = await SHRepository.ensureAndIncrementSignalId("esv-1");
      expect(result).toBe(initial + 1);
      expect(
        mockSignalCounters.find((r) => r.eserviceId === "esv-1")!.signalId,
      ).toBe(initial + 1);
    });
  });
});
