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
    logger.info("decodePublicKey " + publicKey);

    if (!publicKey) {
      throw ErrorHandling.genericInternalError("Error: public key not valid");
    }
    const publicKeyBuffer = Buffer.from(publicKey);
    const publicKeyString = publicKeyBuffer.toString("base64");
    console.log("publicKeyString: " + publicKeyString);

    const _publicKey = `-----BEGIN PUBLIC KEY-----
        ${publicKeyString}
        -----END PUBLIC KEY-----`;

    console.log("_publicKey: " + _publicKey);

    return await jose.JWK.asKey(_publicKey, "pem");
  } catch (err) {
    console.log("err_pem   " + err);
    throw ErrorHandling.thirdPartyCallError("PK_DECODE", JSON.stringify(err));
  }
}
// rs256
export async function generateRSAPublicKey(jwk: JWK): Promise<jose.JWK.Key> {
  try {
    return await jose.JWK.asKey(jwk, "json");
  } catch (err) {
    console.log("err_pem   " + err);
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
    console.log("La firma del token è valida:", result);
    return true;
  } catch (error) {
    console.error("Errore durante la verifica del token:", error);
    return false;
  }
}
