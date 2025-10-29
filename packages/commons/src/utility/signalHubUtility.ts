import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { logger } from "../index.js";

export enum HashAlgorithm {
  SHA256 = "sha256",
  SHA512_256 = "sha512-256",
  SHA384 = "sha384",
  SHA512 = "sha512",
  SHA3_256 = "sha3-256",
  SHA3_384 = "sha3-384",
  SHA3_512 = "sha3-512",
  SHAKE128 = "shake128",
  SHAKE256 = "shake256",
}

export async function generateObjectId(
  fiscalCode: string,
  cryptoHashFunction: HashAlgorithm,
  seed: string
): Promise<string> {
  const data = fiscalCode.concat(seed);

  try {
    const hash = crypto
      .createHash(cryptoHashFunction)
      .update(data)
      .digest("hex");
    logger.info(
      `[SignalHubUtility] Generato objectId hash (${cryptoHashFunction}): ${hash}`
    );
    return hash;
  } catch (error) {
    logger.error(
      `[SignalHubUtility] Errore durante la creazione dell'hash: ${error}`
    );
    throw new Error(
      `Algoritmo di hash non supportato o errato: ${cryptoHashFunction}`
    );
  }
}

export async function getEserviceIdFromToken(token: string): Promise<string> {
  try {
    const decodedPayload = jwt.decode(token);

    if (typeof decodedPayload !== "object" || decodedPayload === null) {
      throw new Error("Payload del token non valido o nullo.");
    }

    const eserviceId = decodedPayload.eserviceId;

    if (!eserviceId || typeof eserviceId !== "string") {
      logger.error(
        "[SignalHubUtility] Campo 'eserviceId' non trovato o non valido nel token JWT."
      );
      throw new Error("Payload token non valido o 'eserviceId' mancante.");
    }

    return eserviceId;
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    logger.error(
      `[SignalHubUtility] Errore durante la decodifica del token JWT: ${errorMessage}`
    );
    throw new Error("Token JWT malformato o illeggibile.");
  }
}
