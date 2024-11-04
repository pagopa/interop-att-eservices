import crypto from "crypto";
import { logger } from "pdnd-common";

// Definisci la chiave pubblica in formato PEM
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
 * Verifica la validità di una firma digitale utilizzando la chiave pubblica e l'algoritmo SHA256.
 *
 * @param data - I dati originali che sono stati firmati
 * @param signatureBase64 - La firma in formato base64
 * @returns `true` se la firma è valida, altrimenti `false`
 */
export function verifySignature(
  data: string,
  signatureBase64: string
): boolean {
  // Converti la firma da base64 a Buffer
  const signature: Buffer = Buffer.from(signatureBase64, "base64");

  // Crea un oggetto per la verifica della firma
  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();

  // Verifica la firma utilizzando la chiave pubblica
  const isVerified: boolean = verify.verify(publicKey, signature);

  // Stampa dei dettagli (facoltativo, può essere rimosso per produzione)
  logger.info(`Dati originali: ${data}`);
  logger.info(`Firma (in byte): ${signature.toString("hex")}`);
  logger.info(`Risultato verifica: ${isVerified ? "valida" : "non valida"}`);

  // Ritorna il risultato della verifica
  return isVerified;
}
