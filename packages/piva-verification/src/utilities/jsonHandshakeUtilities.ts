import { HandshakeModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToHandshake(
  inputString: string | null
): HandshakeModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe HandshakeModel
    return classToPlain(parsedObject) as HandshakeModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToHandshakeArray(
  inputString: string | null
): HandshakeModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un array JavaScript
    const parsedArray = JSON.parse(inputString);

    // Controlla se il risultato è un array
    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    // Mappa ogni elemento dell'array e lo converte in un'istanza della classe HandshakeModel
    return parsedArray.map(
      (item: HandshakeModel) => classToPlain(item) as HandshakeModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
