import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { ResponseRequestDigitalAddress } from "../model/domain/models.js";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToVerifyRequest(
  inputString: string | null
): VerifyRequest | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe FiscalcodeModel
    return classToPlain(parsedObject) as VerifyRequest;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToVerifyRequestArray(
  inputString: string | null
): VerifyRequest[] | null {
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

    // Mappa ogni elemento dell'array e lo converte in un'istanza della classe FiscalcodeModel
    return parsedArray.map(
      (item: VerifyRequest) => classToPlain(item) as VerifyRequest
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}

/* eslint-disable */
export function convertStringToVerifyRequest(jsonString: any): VerifyRequest {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    return {
      idRequest: parsed.idRequest,
      jsonRequest: parsed.jsonRequest,
      count: parsed.count,
    };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}

/* eslint-disable */
export function convertStringToResponseRequestDigitalAddress(
  jsonString: any
): ResponseRequestDigitalAddress {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    return {
      digitalAddress: parsed.digitalAddress,
      codiceFiscale: parsed.codiceFiscale,
      since: parsed.since,
    };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
