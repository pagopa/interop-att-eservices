import { logger } from "pdnd-common";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

export class keychainSignatureUtility {
  private kmsClient: KMSClient;
  private keyId: string;

  constructor(keyId: string) {
    this.kmsClient = new KMSClient({});
    this.keyId = keyId;
    logger.info(`Client KMS inizializzato per la chiave: ${keyId}`);
  }

  /**
   * Generates a digital signature using SHA256 with RSA.
   *
   * @param data - The data to be signed
   * @returns The digital signature in base64
   * */
  public async signData(data: string): Promise<string> {
    try {
      const dataBuffer = Buffer.from(data, "utf-8");

      const signCommand = new SignCommand({
        KeyId: this.keyId,
        Message: dataBuffer,
        SigningAlgorithm: "RSASSA_PKCS1_V1_5_SHA_256",
      });

      const response = await this.kmsClient.send(signCommand);
      const signature = response.Signature
        ? Buffer.from(Uint8Array.from(response.Signature)).toString("base64")
        : null;

      if (!signature) {
        throw new Error("La firma non è stata generata correttamente");
      }

      logger.info("Firma generata con successo");
      return signature;
    } catch (error) {
      logger.error("Errore durante la generazione della firma:", error);
      throw error;
    }
  }
}
