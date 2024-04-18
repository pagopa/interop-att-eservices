import {
  KMSClient,
  SignCommand,
  SignCommandInput,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { ErrorHandling } from "pdnd-models";
import { logger, signerConfig } from "../index.js";

/**
 * Service to sign data using AWS KMS
 * [https://docs.aws.amazon.com/kms/latest/APIReference/API_Sign.html]
 *
 * Requirements: the caller must have kms:Sign permission on the KMS key.
 * Note: When used with the supported RSA signing algorithms, the encoding of this value is defined by PKCS #1 in RFC 8017.
 *
 * @param keyId
 *     Identifies the asymmetric KMS key to use for signing.
 * @param data
 *   The message or message digest to sign.
 * @return
 *  The cryptographic signature that was generated for the message.
 *
 * @throws KMSInvalidStateException
 */
export type SignerService = {
  signWithRSA256: (keyId: string, data: string) => Promise<string>;
};

export const buildSignerService = (): SignerService => {
  const config = signerConfig();
  logger.info(`signerService: aws-kms url: ${config.kmsEndpoint}`);
  
  const kmsClient = config.kmsEndpoint
    ? new KMSClient({
        endpoint: config.kmsEndpoint,
      })
    : new KMSClient();

  return {
    signWithRSA256: async (keyId: string, data: string): Promise<string> => {
      const input: SignCommandInput = {
        KeyId: keyId,
        Message: Buffer.from(data),
        MessageType: "RAW",
        SigningAlgorithm: SigningAlgorithmSpec.RSASSA_PKCS1_V1_5_SHA_256,
      };

      try {
        const command = new SignCommand(input);
        const res = await kmsClient.send(command);

        if (!res.Signature) {
          throw ErrorHandling.genericInternalError(
            "KMS response does not contain a signature"
          );
        }

        const base64JWS = Buffer.from(res.Signature).toString("base64");
        logger.info(`signerService: buildSigner done`);
        return base64JWS
          .replaceAll("=", "")
          .replaceAll("+", "-")
          .replaceAll("/", "_");
      } catch (err) {
        const internalError = ErrorHandling.thirdPartyCallError(
          "KMS",
          JSON.stringify(err)
        );
        logger.error(internalError);
        throw internalError;
      }
    },
  };
};
