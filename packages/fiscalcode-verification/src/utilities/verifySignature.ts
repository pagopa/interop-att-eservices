import crypto from "node:crypto";
import { logger } from "pdnd-common";

const publicKey: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvvUQjnpILrt6c3ORihSM
mswDkdxd55ECsSGWT02Cb5tXASdUDjxtNEbVXvzyZ2XruF0GW7r1BdswA4Mavbfl
gVMNjDVnSLlH4rnvULM4LVvmxKExe7w/ZAxxdBauZBHWziHv680o8jXDrblHAYMD
w7sXljaiAsvwZ3j/lND63m7zvtVvuOQc/8m+zrnYZy9vFpri45/ELpg21mlrF+Ys
duGkkYDejKaDt8F4fUrUJbaXj1lXkNeT6eOk2Qv2wLQjeadHpR4bVbYlEpJmHV/R
6iSHe6krqU8BwlKmI/qmmIYZzw//rQR9Apds7/L/TaimRcy5DA9y0fHG/BPxbgoL
AwIDAQAB
-----END PUBLIC KEY-----`;

/**
 * Verifies the validity of a digital signature using the public key and the SHA256 algorithm.
 *
 * @param data - The original data that was signed
 * @param signatureBase64 - The signature in base64 format
 * @returns `true` if the signature is valid, otherwise `false
 *  */
export function verifySignature(
  data: string,
  signatureBase64: string
): boolean {
  const signature: Buffer = Buffer.from(signatureBase64, "base64");

  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();

  const isVerified: boolean = verify.verify(publicKey, signature);

  logger.info(`Dati originali: ${data}`);
  logger.info(`Firma (in byte): ${signature.toString("hex")}`);
  logger.info(`Risultato verifica: ${isVerified ? "valida" : "non valida"}`);

  return isVerified;
}
