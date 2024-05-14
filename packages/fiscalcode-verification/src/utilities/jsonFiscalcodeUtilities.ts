import { FiscalcodeModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { Richiesta } from "../model/domain/models.js";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToFiscalcode(
  inputString: string | null
): FiscalcodeModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe FiscalcodeModel
    return classToPlain(parsedObject) as FiscalcodeModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToFiscalcodeArray(
  inputString: string | null
): FiscalcodeModel[] | null {
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
      (item: FiscalcodeModel) => classToPlain(item) as FiscalcodeModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}

/* eslint-disable */
export function convertStringToRichiesta(jsonString: any): Richiesta {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    if (typeof parsed.codiceFiscale !== "string") {
      throw new Error("Invalid codiceFiscale type");
    }

    const codiceFiscalePattern =
      /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/;
    const codiceFiscale = parsed.codiceFiscale;

    if (!codiceFiscalePattern.test(codiceFiscale)) {
      throw new Error("Invalid codiceFiscale format");
    }

    if (codiceFiscale.length < 11 || codiceFiscale.length > 16) {
      throw new Error("Invalid codiceFiscale length");
    }

    return { codiceFiscale: { codiceFiscale } };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
