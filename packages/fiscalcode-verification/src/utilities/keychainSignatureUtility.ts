import { logger } from "pdnd-common";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { keychainSignerConfig } from "../config/keychainSignerConfig.js";

const config = keychainSignerConfig();

export class keychainSignatureUtility {
  private kmsClient: KMSClient;
  private keyId: string;

  constructor(keyId: string) {
    const isLocal = config.localKeychainConfig === true;
    if (isLocal) {
      this.kmsClient = new KMSClient({
        region: config.kmsRegion,
        endpoint: config.kmsKeychainEndpoint,
        credentials: {
          accessKeyId: config.kmsAccessKeyId,
          secretAccessKey: config.kmsAccessKeySecret,
        },
      });
    } else {
      this.kmsClient = new KMSClient({});
    }
    this.keyId = keyId;
    logger.info(`Client KMS initialized with key: ${keyId}`);
  }

  /**
   * Generates a digital signature using SHA256 with RSA.
   *
   * @param data - The data to be signed
   * @returns The digital signature in base64 format
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
        throw new Error("Signature generation failure");
      }

      logger.info("Signature successfully generated");
      return signature;
    } catch (error) {
      logger.error("Error during signature generation:", error);
      throw error;
    }
  }
}
