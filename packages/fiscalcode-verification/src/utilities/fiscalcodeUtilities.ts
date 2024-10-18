import { FiscalcodeModel } from "pdnd-models";
import { fiscalcodeNotFound } from "../exceptions/errors.js";

/* eslint-disable */
// Funzione che aggiunge una lista di FiscalcodeModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniqueFiscalcodeModelsToArray(
  existingArray: FiscalcodeModel[] | null,
  modelsToAdd: FiscalcodeModel[] | null
): FiscalcodeModel[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un mappatura dei pourposeId ai modelli esistenti
  const modelMap = new Map<string, FiscalcodeModel>();
  for (const model of newArray) {
    modelMap.set(model.fiscalCode, model);
  }

  // Aggiungiamo o aggiorniamo i modelli
  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.fiscalCode);
    if (existingModel) {
      // Se il pourposeId esiste già, aggiorniamo i dati con quelli passati
      Object.assign(existingModel, modelToAdd);
    } else {
      // Se il pourposeId non esiste, aggiungiamo il nuovo modello
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findFiscalcodeModelByFiscalcode(
  fiscalCodes: FiscalcodeModel[] | null,
  fiscalCode: string
): FiscalcodeModel | null {
  if (fiscalCodes == null) return null;
  for (const fiscalCodeModel of fiscalCodes) {
    if (fiscalCodeModel.fiscalCode === fiscalCode) {
      return fiscalCodeModel;
    }
  }
  return null; // Se non viene trovato nessun oggetto corrispondente
}

// Funzione che cerca un FiscalcodeModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function deleteFiscalcodeModelByFiscaldode(
  existingArray: FiscalcodeModel[] | null,
  fiscalCode: string
): FiscalcodeModel[] | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw fiscalcodeNotFound();
  }
  const result: FiscalcodeModel[] = [];

  // Cerca FiscalcodeModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.fiscalCode !== fiscalCode) {
      result.push(fiscalCodeM);
    }
  }

  return result; // Restituisci l'oggetto FiscalcodeModel trovato, se presente
}

// Funzione per validare una lista di FiscalcodeModel
export const areFiscalCodesValid = (
  fiscalCodeList: FiscalcodeModel[]
): boolean => {
  return fiscalCodeList.every((item) => {
    const parsedItem = FiscalcodeModel.safeParse(item);
    return parsedItem.success && parsedItem.data.fiscalCode.length > 5;
  });
};
