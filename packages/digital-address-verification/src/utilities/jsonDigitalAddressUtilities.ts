import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { RequestListDigitalAddress } from "../model/domain/models.js";

// 1. RequestListDigitalAddress
// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToRequestListDigitalAddress(
  inputString: string | null
): RequestListDigitalAddress | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe FiscalcodeModel
    return classToPlain(parsedObject) as RequestListDigitalAddress;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
