import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToResponseRequestDigitalAddress(
  inputString: string | null
): ResponseRequestDigitalAddressModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe FiscalcodeModel
    return classToPlain(parsedObject) as ResponseRequestDigitalAddressModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToResponseRequestDigitalAddressArray(
  inputString: string | null
): ResponseRequestDigitalAddressModel[] | null {
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
      (item: ResponseRequestDigitalAddressModel) => classToPlain(item) as ResponseRequestDigitalAddressModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}


/* eslint-disable */
export function convertStringToRichiesta(jsonString: any): ResponseRequestDigitalAddressModel {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    return {
      codiceFiscale: parsed.codiceFiscale,
      since: parsed.since,
      digitalAddress: parsed.digitalAddress.map((item: any) => ({
        digitalAddress: item.digitalAddress,
        practicedProfession: item.practicedProfession,
        usageInfo: {
          motivation: item.usageInfo.motivation,
          dateEndValidity: item.usageInfo.dateEndValidity,
        },
      })),
    };
  } catch (error) {
    console.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
