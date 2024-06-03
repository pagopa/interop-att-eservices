import { fiscalcodeNotFound } from "../exceptions/errors.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";

/* eslint-disable */
// Funzione che aggiunge una lista di FiscalcodeModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniqueVerifyRequestToArray(
  existingArray: VerifyRequest[] | null,
  modelsToAdd: VerifyRequest[] | null
): VerifyRequest[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un mappatura dei pourposeId ai modelli esistenti
  const modelMap = new Map<string, VerifyRequest>();
  for (const model of newArray) {
    modelMap.set(model.idRequest, model);
  }

  // Aggiungiamo o aggiorniamo i modelli
  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.idRequest);
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

export function findRequestlByIdRequest(fiscalCodes: VerifyRequest[] | null, idRequest: string): VerifyRequest | null {
  if (fiscalCodes == null ) return null;
  for (const fiscalCodeModel of fiscalCodes) {
      if (fiscalCodeModel.idRequest === idRequest) {
          return fiscalCodeModel;
      }
  }
  return null; // Se non viene trovato nessun oggetto corrispondente
}

// Funzione che cerca un FiscalcodeModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function deleteRequestByIdRequest(
  existingArray: VerifyRequest[] | null,
  idRequest: string
): VerifyRequest[] | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw fiscalcodeNotFound();
  }
  const result: VerifyRequest[] = [];

  // Cerca FiscalcodeModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.idRequest !== idRequest) {
      result.push(fiscalCodeM);
    }
  }

  return result; // Restituisci l'oggetto FiscalcodeModel trovato, se presente
}
