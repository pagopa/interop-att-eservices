import {
  logger,
  signerConfig,
  buildPublicKeyService,
  getKidFromJWTToken,
  getOauth2Token,
  generateInternalAccessCode,
} from "pdnd-common";
import { getkeyClient } from "interoperability";
import { ErrorHandling } from "pdnd-models";
import {
  decodePublicKey,
  generateRSAPublicKey,
  verify,
} from "../utilities/rsaUtility.js";
export const validate = (jwtToken: string, source: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      /* const config = signerConfig.parse(process.env); */
      const config = signerConfig();
      const publicKeyService = buildPublicKeyService();

      // Recupera il kid dal token JWT
      publicKeyService
        .getRSAPublicKey(config.kmsKeyId)
        .then((pk) => decodePublicKey(pk))
        .then((pkDecoded) => generateInternalAccessCode(pkDecoded.kid))
        .then((accessCodeSigned) => {
          if (accessCodeSigned == null) {
            logger.error(
              `${source}-publicKeyService: accessCodeSigned is null`
            );
            throw ErrorHandling.tokenNotValid();
          }
          return getOauth2Token(accessCodeSigned.serialized);
        })
        .then((tokenGenerated) => {
          const kid = getKidFromJWTToken(jwtToken);
          return Promise.all([tokenGenerated, kid]);
        })
        .then(([tokenGenerated, kid]) => {
          if (tokenGenerated === undefined) {
            return Promise.reject(ErrorHandling.tokenNotValid());
          }
          return getkeyClient(tokenGenerated, kid);
        })
        .then((result) => {
          if (!result) {
            logger.error(
              `${source}-publicKeyService: Unexpected error during token generation`
            );
            throw ErrorHandling.tokenNotValid();
          }
          return generateRSAPublicKey(result);
        })
        .then((publicKey) => verify(publicKey, jwtToken))
        .then((isValid) => {
          logger.info(`interoperability  - token valid: ${isValid}`);
          resolve(isValid);
        })
        .catch((err) => {
          logger.error(`${source} - Unexpected error parsing token: ${err}`);
          resolve(false);
        });
    } catch (err) {
      logger.error(`${source} - Unexpected error parsing token: ${err}`);
      reject(err);
    }
  });
