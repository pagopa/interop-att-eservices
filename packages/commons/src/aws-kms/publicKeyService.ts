import {
  KMSClient,
  GetPublicKeyCommand
} from "@aws-sdk/client-kms";
import {
  ErrorHandling,
} from "pdnd-model";
import { logger, signerConfig } from "../index.js";

export type PublicKeyService = {
  getRSAPublicKey: (keyId: string) => Promise<Uint8Array>;
};

export const buildPublicKeyService = (): PublicKeyService => {
  const config = signerConfig();
  logger.info ("aws config:kmsEndpoint " + config.kmsEndpoint);
  const kmsClient = config.kmsEndpoint ? new KMSClient(
    {
      endpoint: config.kmsEndpoint
    },
  ) : new KMSClient();

  return {
    getRSAPublicKey: async (keyId: string): Promise<Uint8Array> => {
      const input = {
        KeyId: keyId,
      };

      try {
        const command = new GetPublicKeyCommand(input);
        const res = await kmsClient.send(command);
   
        if (!res.PublicKey) {
          throw ErrorHandling.genericInternalError(
            "KMS response does not contain a public key"
          );
        }
        return res.PublicKey;
      } catch (err) {
        const internalError = ErrorHandling.thirdPartyCallError("KMS", JSON.stringify(err));
        logger.error(internalError);
        throw internalError;
      }
    },
  };
};
