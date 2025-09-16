/* eslint-disable functional/no-let */
import { describe, it, expect, vi, afterEach } from "vitest";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { SubjectDataResponseRepository } from "../../src/repositories/digital-address-verification/subjectDataResponseRepository.js";

const { mockClient, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };
  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
  };
  return { mockClient, mockDbChain };
});

vi.mock("../../src/index.js", () => ({
  client: mockClient,
  logger: { error: vi.fn() },
}));

describe("SubjectDataResponseRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("upsert", () => {
    it("dovrebbe fare l'upsert di una risposta e restituire il suo ID", async () => {
      const item: ResponseRequestDigitalAddressModel = {
        idSubject: "RSSMRA80A01H501U",
        from: new Date().toISOString(),
        digitalAddress: [],
      };
      const mockUpsertResult = { id: 99 };
      vi.mocked(mockDbChain.returning).mockResolvedValue([mockUpsertResult]);
      const result = await SubjectDataResponseRepository.upsert(
        "list-req-1",
        item
      );
      expect(result).toBe(99);
      expect(mockClient.insert).toHaveBeenCalled();
    });

    it("dovrebbe lanciare un errore se l'upsert non restituisce un ID", async () => {
      const item: ResponseRequestDigitalAddressModel = {
        idSubject: "RSSMRA85M01H501T",
        from: new Date().toISOString(),
        digitalAddress: [],
      };
      vi.mocked(mockDbChain.returning).mockResolvedValue([]);
      await expect(
        SubjectDataResponseRepository.upsert("list-req-2", item)
      ).rejects.toThrow();
    });
  });
});
