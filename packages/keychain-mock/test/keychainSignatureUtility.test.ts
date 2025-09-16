/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { logger } from "pdnd-common";
import { keychainSignatureUtility } from "../src/utilities/keychainSignatureUtility.js";

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("keychainSignatureUtility", () => {
  const mockKeyId = "mock-key-id";
  const dataToSign = "example data to sign";

  beforeEach(() => {
    vi.spyOn(KMSClient.prototype, "send").mockImplementation(
      async (command) => {
        if (command instanceof SignCommand) {
          return {
            Signature: new Uint8Array([104, 101, 108, 108, 111]),
          };
        }
        throw new Error("Mock received an unexpected command type.");
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should correctly generate a base64 signature", async () => {
    const utility = new keychainSignatureUtility(mockKeyId);
    const signature = await utility.signData(dataToSign);

    expect(signature).toBe("aGVsbG8=");
  });

  it("should throw an error if the signature cannot be generated", async () => {
    vi.spyOn(KMSClient.prototype, "send").mockResolvedValueOnce({
      Signature: undefined,
    } as any);

    const utility = new keychainSignatureUtility(mockKeyId);

    await expect(utility.signData(dataToSign)).rejects.toThrow(
      "La firma non è stata generata correttamente"
    );
  });

  it("should log an error in case of an exception", async () => {
    const error = new Error("Mock error");
    vi.spyOn(KMSClient.prototype, "send").mockRejectedValueOnce(error);
    const utility = new keychainSignatureUtility(mockKeyId);

    await expect(utility.signData(dataToSign)).rejects.toThrow("Mock error");
    expect(logger.error).toHaveBeenCalledWith(
      "Errore durante la generazione della firma:",
      error
    );
  });
});
