/* eslint-disable no-console */
import * as jwt from "jsonwebtoken";
interface CustomTokenPayload {
  eserviceId: string;
}

export async function getEserviceIdFromToken(
  authorizationHeader: string
): Promise<string> {
  try {
    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new Error(
        "Header Authorization mancante o malformato (manca 'Bearer ')."
      );
    }
    const token = authorizationHeader.split(" ")[1]; // Estrae il token puro
    if (!token) {
      throw new Error("Token non presente nell'header.");
    }
    const decodedPayload = jwt.decode(token) as CustomTokenPayload | null;

    console.log(
      "[getEserviceIdFromToken] Payload decodificato:",
      decodedPayload
    );

    if (typeof decodedPayload !== "object" || decodedPayload === null) {
      throw new Error("Payload del token non valido o nullo.");
    }

    const eserviceId = decodedPayload.eserviceId;

    if (!eserviceId || typeof eserviceId !== "string") {
      console.error(
        "[getEserviceIdFromToken] Campo 'eserviceId' non trovato o non valido nel token JWT."
      );
      throw new Error("Payload token non valido o 'eserviceId' mancante.");
    }

    return eserviceId;
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    console.error(
      `[getEserviceIdFromToken] Errore durante la decodifica del token JWT: ${errorMessage}`
    );
    throw new Error("Token JWT malformato o illeggibile.");
  }
}
