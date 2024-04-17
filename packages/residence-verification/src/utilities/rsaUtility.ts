import { ErrorHandling } from "pdnd-models";
import { JWK } from "interoperability";
import { logger } from "pdnd-common";
// import { signerConfig } from "../index.js";
import jose from "node-jose";
// import { JWS, JWK } from 'node-jose';
export async function decodePublicKey(
  publicKey: Uint8Array
): Promise<jose.JWK.Key> {
  try {
    logger.info(`[START] decode public key`);

    if (!publicKey) {
      throw ErrorHandling.genericInternalError("Error: public key not valid");
    }
    const publicKeyBuffer = Buffer.from(publicKey);
    const publicKeyString = publicKeyBuffer.toString("base64");

    const _publicKey = `-----BEGIN PUBLIC KEY-----
        ${publicKeyString}
        -----END PUBLIC KEY-----`;

    return await jose.JWK.asKey(_publicKey, "pem");

  } catch (err) {
    logger.error(`Error decode public key: ${err}`);
    throw ErrorHandling.thirdPartyCallError("PK_DECODE", JSON.stringify(err));
  }
}
// rs256
export async function generateRSAPublicKey(jwk: JWK): Promise<jose.JWK.Key> {
  try {
    return await jose.JWK.asKey(jwk, "json");
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
    // Crea un verificatore per il token JWT utilizzando la chiave pubblica
    const verifier = jose.JWS.createVerify(key);

    // Verifica il token JWT
    const result = await verifier.verify(token);
    logger.info(`La firma del token è valida: ${result}`);

    return true;
  } catch (error) {
    logger.error(`Errore durante la verifica del token: ${error}`);
    return false;
  }
}
