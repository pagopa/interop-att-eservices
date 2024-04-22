import { KMSClient, GetPublicKeyCommand } from "@aws-sdk/client-kms";
import { ErrorHandling } from "pdnd-models";
import { logger, signerConfig } from "../index.js";

export type PublicKeyService = {
  getRSAPublicKey: (keyId: string) => Promise<Uint8Array>;
  KMSAvailability: (keyId: string) => Promise<Boolean>;
};

export const buildPublicKeyService = (): PublicKeyService => {
  const config = signerConfig();
  const kmsClient = config.kmsEndpoint
    ? new KMSClient({
        endpoint: config.kmsEndpoint,
      })
    : new KMSClient();

    
  return {
    getRSAPublicKey: async (keyId: string): Promise<Uint8Array> => {
      const input = {
        KeyId: keyId,
      };

      
      try {

        logger.info ("config.kmsEndpoint: " + config.kmsEndpoint);
        logger.info ("input: " + input);

        const command = new GetPublicKeyCommand(input);
        const res = await kmsClient.send(command);

        if (!res.PublicKey) {
          logger.info(`KMS response does not contain a public key`);
          throw ErrorHandling.genericInternalError(
            `KMS response does not contain a public key`
          );
        }
        logger.info(`publicKeyService: buildPublicKey done`);
        return res.PublicKey;
      } catch (err) {
        const internalError = ErrorHandling.thirdPartyCallError(
          "KMS",
          JSON.stringify(err)
        );
        logger.error(`buildPublicKeyService: ${internalError}`);
        throw internalError;
      }
    },
    

    KMSAvailability : async (keyId: string) :  Promise<Boolean>=>  {
      try {
        // Effettua una richiesta di test al servizio KMS
        const command = new GetPublicKeyCommand({ KeyId: keyId });
        await kmsClient.send(command);
    
        // Se la richiesta ha avuto successo, il servizio KMS è raggiungibile
        return true;
      } catch (error) {
        // Se si verifica un errore, gestiscilo di conseguenza
        console.error("Error reaching KMS service:", error);
        return false;
      }
    },
  }
  
  
  ;
};
