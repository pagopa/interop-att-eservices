import { PartitaIvaModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { Richiesta } from "../model/domain/models.js";

export function parseJsonToPiva(
  inputString: string | null
): PartitaIvaModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as PartitaIvaModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}
export function parseJsonToPivaArray(
  inputString: string | null
): PartitaIvaModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedArray = JSON.parse(inputString);

    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    return parsedArray.map(
      (item: PartitaIvaModel) => classToPlain(item) as PartitaIvaModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
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
