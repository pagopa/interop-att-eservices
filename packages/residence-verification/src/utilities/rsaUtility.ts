import { ErrorHandling } from "pdnd-models";
import { JWK } from "interoperability";
import { logger } from "pdnd-common";
import jose from "node-jose";
export async function decodePublicKey(
  publicKey: Uint8Array
): Promise<jose.JWK.Key> {
  try {
    if (!publicKey) {
      throw ErrorHandling.genericInternalError("Error: public key not valid");
    }
    const publicKeyBuffer = Buffer.from(publicKey);
    const publicKeyString = publicKeyBuffer.toString("base64");

    const tmpPublicKey = `-----BEGIN PUBLIC KEY-----
        ${publicKeyString}
        -----END PUBLIC KEY-----`;

    const result = await jose.JWK.asKey(tmpPublicKey, "pem");

    logger.info(`publicKeyService: decodePublicKey done`);

    return result;
  } catch (err) {
    logger.error(`Error decode public key: ${err}`);
    throw ErrorHandling.thirdPartyCallError("PK_DECODE", JSON.stringify(err));
  }
}

export async function generateRSAPublicKey(jwk: JWK): Promise<jose.JWK.Key> {
  try {
    const result = await jose.JWK.asKey(jwk, "json");
    logger.info(`generateRSAPublicKey: done`);
    return result;
  } catch (err) {
    logger.error(`Error decode public key: ${err}`);
    throw ErrorHandling.thirdPartyCallError("PK_DECODE", JSON.stringify(err));
  }
}

export async function verify(
  key: jose.JWK.Key,
  token: string
): Promise<boolean> {
  try {
    const verifier = jose.JWS.createVerify(key);

    const result = await verifier.verify(token);
    logger.info(`La firma del token è valida: ${result}`);

    return true;
  } catch (error) {
    logger.error(`Errore durante la verifica del token: ${error}`);
    return false;
  }
}
