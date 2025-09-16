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
        return { Signature: null };
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("it should properly initialize the KMS client with the key ID", () => {
    const utility = new keychainSignatureUtility(mockKeyId);
    expect(utility).toBeDefined();
    expect(utility["keyId"]).toBe(mockKeyId);
  });

  it("it should correctly generate a base64 signature", async () => {
    const utility = new keychainSignatureUtility(mockKeyId);
    const signature = await utility.signData(dataToSign);

    expect(signature).toBe("aGVsbG8=");
  });

  it("it should throw an error if the signature cannot be generated", async () => {
    vi.spyOn(KMSClient.prototype, "send").mockResolvedValueOnce({
      Signature: null,
    });
    const utility = new keychainSignatureUtility(mockKeyId);

    await expect(utility.signData(dataToSign)).rejects.toThrow(
      "Signature generation failure"
    );
  });

  it("dovrebbe loggare un errore in caso di eccezione", async () => {
    const error = new Error("Mock error");
    vi.spyOn(KMSClient.prototype, "send").mockRejectedValueOnce(error);
    const utility = new keychainSignatureUtility(mockKeyId);

    await expect(utility.signData(dataToSign)).rejects.toThrow("Mock error");
    expect(logger.error).toHaveBeenCalledWith(
      "Error during signature generation:",
      error
    );
  });
});
