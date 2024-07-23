import { PartitaIvaModel } from "pdnd-models";
import { pivaNotFound } from "../exceptions/errors.js";

/* eslint-disable */
// Funzione che aggiunge una lista di HandshakeModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniquePivaModelsToArray(
  existingArray: PartitaIvaModel[] | null,
  modelsToAdd: PartitaIvaModel[] | null
): PartitaIvaModel[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un mappatura dei pourposeId ai modelli esistenti
  const modelMap = new Map<string, PartitaIvaModel>();
  for (const model of newArray) {
    modelMap.set(model.organizationId, model);
  }

  // Aggiungiamo o aggiorniamo i modelli
  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.organizationId);
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

export function findPivaModelByPiva(
  pivas: PartitaIvaModel[] | null,
  piva: string
): PartitaIvaModel | null {
  if (pivas == null) return null;
  for (const pivaModel of pivas) {
    if (pivaModel.organizationId === piva) {
      return pivaModel;
    }
  }
  return null; // Se non viene trovato nessun oggetto corrispondente
}

// Funzione che cerca un HandshakeModel all'interno di un array esistente utilizzando il codice piva come criterio di ricerca
export function deletePivaModelByPiva(
  existingArray: PartitaIvaModel[] | null,
  piva: string
): PartitaIvaModel[] | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw pivaNotFound();
  }
  const result: PartitaIvaModel[] = [];

  // Cerca HandshakeModel con lo stesso codice piva all'interno dell'array esistente
  for (const pivaM of existingArray) {
    if (pivaM.organizationId !== piva) {
      result.push(pivaM);
    }
  }

  return result; // Restituisci l'oggetto HandshakeModel trovato, se presente
}

// Funzione per validare una lista di FiscalcodeModel
export const arePartitaIvasValid = (
  partitaIvaList: PartitaIvaModel[]
): boolean => {
  return partitaIvaList.every((item) => {
    const parsedItem = PartitaIvaModel.safeParse(item);
    return parsedItem.success && parsedItem.data.organizationId.length > 5;
  });
};
