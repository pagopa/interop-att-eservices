import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { fiscalcodeNotFound } from "../exceptions/errors.js";

/* eslint-disable */
// Funzione che aggiunge una lista di FiscalcodeModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniqueFiscalcodeModelsToArray(
  existingArray: ResponseRequestDigitalAddressModel[] | null,
  modelsToAdd: ResponseRequestDigitalAddressModel[] | null
): ResponseRequestDigitalAddressModel[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un mappatura dei pourposeId ai modelli esistenti
  const modelMap = new Map<string, ResponseRequestDigitalAddressModel>();
  for (const model of newArray) {
    modelMap.set(model.idSubject, model);
  }

  // Aggiungiamo o aggiorniamo i modelli
  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.idSubject);
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
  fiscalCodes: ResponseRequestDigitalAddressModel[] | null,
  fiscalCode: string
): ResponseRequestDigitalAddressModel | null {
  if (fiscalCodes == null) return null;
  for (const fiscalCodeModel of fiscalCodes) {
    if (fiscalCodeModel.idSubject == fiscalCode) {
      return fiscalCodeModel;
    }
  }
  return null; // Se non viene trovato nessun oggetto corrispondente
}

// Funzione che cerca un FiscalcodeModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function deleteFiscalcodeModelByFiscaldode(
  existingArray: ResponseRequestDigitalAddressModel[] | null,
  fiscalCode: string
): ResponseRequestDigitalAddressModel[] | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw fiscalcodeNotFound();
  }
  const result: ResponseRequestDigitalAddressModel[] = [];

  // Cerca FiscalcodeModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.idSubject !== fiscalCode) {
      result.push(fiscalCodeM);
    }
  }

  return result; // Restituisci l'oggetto FiscalcodeModel trovato, se presente
}
