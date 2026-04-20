import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { translateKeys, ResidenceSubmissionService } from "pdnd-common";
import { RichiestaAR003 } from "../src/model/domain/models.js";
import ResidenceSubmissionController from "../src/controllers/residenceSubmissionController.js";
import { InternalRequestAR003 } from "../src/model/internal-models.js";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
    readFileSync: vi.fn(() => "MOCK_PRIVATE_KEY_CONTENT"),
    default: {
      ...actual,
      readFileSync: vi.fn(() => "MOCK_PRIVATE_KEY_CONTENT"),
    },
  };
});

const { mockUserModelNotFound } = vi.hoisted(() => ({
  mockUserModelNotFound: vi.fn((detail?: string) => {
    const err = new Error(detail ?? "Data not found");
    (err as any).code = "userModelNotFound";
    return err;
  }),
}));

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  getContext: vi.fn(),
  translateKeys: vi.fn(),
  ResidenceSubmissionService: {
    create: vi.fn(),
    updateBySubjectId: vi.fn(),
    delete: vi.fn(),
  },
  REQ_AR003_ITA_TO_ENG: {},
  userModelNotFound: mockUserModelNotFound,
}));

describe("ResidenceSubmissionController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return OK on successful user creation", async () => {
    const mockRequestItaliana = {
      idOperazioneClient: "OP-123",
      soggetto: {
        codiceFiscale: "RSSMRA80A01H501U",
      },
    } as unknown as RichiestaAR003;

    const mockInternalRequest = {
      operationId: "OP-123",
      subjects: {
        subject: {
          generality: {
            subjectId: { subjectId: "RSSMRA80A01H501U" },
          },
        },
      },
    };
    vi.mocked(translateKeys).mockReturnValue(
      mockInternalRequest as InternalRequestAR003
    );

    vi.mocked(ResidenceSubmissionService.create).mockResolvedValue();

    const result = await ResidenceSubmissionController.createUser(
      mockRequestItaliana
    );

    expect(translateKeys).toHaveBeenCalledWith(
      mockRequestItaliana,
      expect.anything()
    );
    expect(ResidenceSubmissionService.create).toHaveBeenCalledWith(
      mockInternalRequest
    );
    expect(result).toEqual({
      status: "OK",
      message: "Utente creato con successo",
    });
  });

  it("should return OK on successful user update", async () => {
    const mockRequestItaliana = {
      idOperazioneClient: "OP-UPDATE",
      soggetto: { codiceFiscale: "RSSMRA..." },
    } as unknown as RichiestaAR003;

    const mockInternalRequest = { operationId: "OP-UPDATE", foo: "bar" };

    vi.mocked(translateKeys).mockReturnValue(
      mockInternalRequest as InternalRequestAR003
    );
    vi.mocked(ResidenceSubmissionService.updateBySubjectId).mockResolvedValue();

    const result = await ResidenceSubmissionController.updateUser(
      mockRequestItaliana
    );

    expect(ResidenceSubmissionService.updateBySubjectId).toHaveBeenCalledWith(
      mockInternalRequest
    );
    expect(result).toEqual({
      status: "OK",
      message: "Utente aggiornato con successo",
    });
  });

  it("should return OK on successful user deletion", async () => {
    const mockId = "RSSMRA...";

    vi.mocked(ResidenceSubmissionService.delete).mockResolvedValue();

    const result = await ResidenceSubmissionController.deleteUser(mockId);

    expect(ResidenceSubmissionService.delete).toHaveBeenCalledWith(mockId);
    expect(result).toEqual({
      status: "OK",
      message: "Utente eliminato con successo",
    });
  });

  it("should re-throw the original error when createUser fails", async () => {
    const serviceError = new Error("DB connection failed");

    vi.mocked(translateKeys).mockReturnValue({} as InternalRequestAR003);
    vi.mocked(ResidenceSubmissionService.create).mockRejectedValue(serviceError);

    await expect(
      ResidenceSubmissionController.createUser({
        idOperazioneClient: "OP-ERR",
        soggetto: { codiceFiscale: "RSSMRA80A01H501U" },
      } as unknown as RichiestaAR003)
    ).rejects.toThrow("DB connection failed");
  });

  it("should throw userModelNotFound when updateUser fails", async () => {
    vi.mocked(translateKeys).mockReturnValue({} as InternalRequestAR003);
    vi.mocked(ResidenceSubmissionService.updateBySubjectId).mockRejectedValue(
      new Error("DB error")
    );

    await expect(
      ResidenceSubmissionController.updateUser({
        idOperazioneClient: "OP-ERR",
        soggetto: { codiceFiscale: "RSSMRA80A01H501U" },
      } as unknown as RichiestaAR003)
    ).rejects.toMatchObject({ code: "userModelNotFound" });

    expect(mockUserModelNotFound).toHaveBeenCalledWith(
      expect.stringContaining("aggiornamento")
    );
  });

  it("should throw userModelNotFound when deleteUser fails", async () => {
    vi.mocked(ResidenceSubmissionService.delete).mockRejectedValue(
      new Error("DB error")
    );

    await expect(
      ResidenceSubmissionController.deleteUser("RSSMRA...")
    ).rejects.toMatchObject({ code: "userModelNotFound" });

    expect(mockUserModelNotFound).toHaveBeenCalledWith(
      "Errore durante l'eliminazione dell'utente., utente non trovato"
    );
  });
});
