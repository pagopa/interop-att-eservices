import { PartitaIvaModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { Richiesta } from "../model/domain/models.js";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToPiva(
  inputString: string | null
): PartitaIvaModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe PartitaIvaModel
    return classToPlain(parsedObject) as PartitaIvaModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToPivaArray(
  inputString: string | null
): PartitaIvaModel[] | null {
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

    // Mappa ogni elemento dell'array e lo converte in un'istanza della classe PartitaIvaModel
    return parsedArray.map(
      (item: PartitaIvaModel) => classToPlain(item) as PartitaIvaModel
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

    if (typeof parsed.partitaIva !== "string") {
      throw new Error("Invalid partitaIva type");
    }

    // Validate partitaIva
    const partitaIvaPattern = /^[0-9]{11}$/;
    const partitaIva = parsed.partitaIva;

    if (typeof partitaIva !== "string" || !partitaIvaPattern.test(partitaIva)) {
      throw new Error("Invalid partitaIva format");
    }

    return { partitaIva: partitaIva ? String(partitaIva) : undefined };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
