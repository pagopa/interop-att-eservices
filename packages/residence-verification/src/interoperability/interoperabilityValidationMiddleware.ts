import {
  logger,
  signerConfig,
  buildPublicKeyService,
  getKidFromJWTToken,
  getOauth2Token,
  generateAndLogInternalAccessCode,
} from "pdnd-common";
import { getkeyClient } from "interoperability";
import { ErrorHandling } from "pdnd-models";
import {
  decodePublicKey,
  generateRSAPublicKey,
  verify,
} from "../utilities/rsaUtility.js";

export const validate = (jwtToken: string): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    try {
      logger.info("validate token");
      /* const config = signerConfig.parse(process.env); */
      const config = signerConfig();
      const signerService = buildPublicKeyService();

      // Recupera il kid dal token JWT
      const pk = await signerService.getRSAPublicKey(config.kmsKeyId);

      const pkDecoded = await decodePublicKey(pk);

      const accessCodeSigned = await generateAndLogInternalAccessCode(
        pkDecoded.kid
      );

      if (accessCodeSigned == null) {
        logger.error(`Unexpected error parsing token`);
        throw ErrorHandling.tokenNotValid();
      }

      const tokenGenerated = await getOauth2Token(accessCodeSigned.serialized);
      const kid = await getKidFromJWTToken(jwtToken);

      if (tokenGenerated != undefined) {
        // Chiamata a getKeyData utilizzando l'internalToken appena generato e il kid
        const result = await getkeyClient(tokenGenerated, kid); // chiave pubblica agid

        if (!result) {
          logger.error(`Unexpected error during token generation`);
          throw ErrorHandling.tokenNotValid();
        }

        const publicKey = await generateRSAPublicKey(result);
        // Verifica il token JWT utilizzando la chiave ottenuta da getKeyData
        try {
          const isValid = await verify(publicKey, jwtToken);
          console.log("isValid: " + isValid);
          resolve(isValid);
        } catch (err) {
          console.error(`Unexpected error parsing token: ${err}`);
          resolve(false);
        }
      }
      // resolve(false);
    } catch (err) {
      console.error(`Unexpected error parsing token: ${err}`);
      reject(err);
    }
  });
