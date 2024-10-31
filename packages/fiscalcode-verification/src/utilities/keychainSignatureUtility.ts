import { logger } from "pdnd-common";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

export class keychainSignatureUtility {
  private kmsClient: KMSClient;
  private keyId: string;

  constructor(keyId: string) {
    // Inizializza il client KMS e imposta l'ID della chiave
    this.kmsClient = new KMSClient({});
    this.keyId = keyId;
    logger.info(`Client KMS inizializzato per la chiave: ${keyId}`);
  }

  /**
   * Genera una firma digitale utilizzando SHA256 con RSA.
   *
   * @param data - I dati da firmare
   * @returns La firma digitale in formato base64
   */
  public async signData(data: string): Promise<string> {
    try {
      // Codifica i dati in un Buffer
      const dataBuffer = Buffer.from(data, "utf-8");

      // Configura il comando di firma utilizzando l'algoritmo RSASSA_PKCS1_V1_5_SHA_256
      const signCommand = new SignCommand({
        KeyId: this.keyId,
        Message: dataBuffer,
        SigningAlgorithm: "RSASSA_PKCS1_V1_5_SHA_256", // Utilizza SHA256 con RSA
      });

      // Esegui il comando di firma
      const response = await this.kmsClient.send(signCommand);
      // Converti la firma in base64 solo se esiste
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
      throw error; // Propaga l'errore per gestirlo altrove
    }
  }
}
