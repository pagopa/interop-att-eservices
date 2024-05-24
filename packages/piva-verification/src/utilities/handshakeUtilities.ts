import { HandshakeModel } from "pdnd-models";

/* eslint-disable */
// Funzione che aggiunge una lista di HandshakeModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniqueHandshakeModelsToArray(
  existingArray: HandshakeModel[] | null,
  modelsToAdd: HandshakeModel[] | null
): HandshakeModel[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un mappatura dei pourposeId ai modelli esistenti
  const modelMap = new Map<string, HandshakeModel>();
  for (const model of newArray) {
    modelMap.set(model.pourposeId, model);
  }

  // Aggiungiamo o aggiorniamo i modelli
  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.pourposeId);
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

export function findHandshakeModelByPourposeId(handshakes: HandshakeModel[] | null, pourposeId: string): HandshakeModel | null {
  if (handshakes == null ) return null;
  for (const handshake of handshakes) {
      if (handshake.pourposeId === pourposeId) {
          return handshake;
      }
  }
  return null; // Se non viene trovato nessun oggetto corrispondente
}

export function isCertUnique(existingArray: HandshakeModel[] | null, modelsToAdd: HandshakeModel[] | null): boolean {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    return true;
  }

  // Creiamo un set per tenere traccia dei cert già presenti nell'existingArray associati a un pourposeId
  const existingCertPourposeMap = new Map<string, string>(); // Mappa il certificato (cert) al pourposeId

  // Popoliamo la mappa con i cert e i pourposeId esistenti
  for (const model of existingArray) {
    existingCertPourposeMap.set(model.cert, model.pourposeId);
  }

  // Iteriamo sui modelli da aggiungere
  for (const model of modelsToAdd) {
    // Verifichiamo se il cert del modello è già presente nell'existingArray associato a un pourposeId diverso
    if (existingCertPourposeMap.has(model.cert)) {
      const existingPourposeId = existingCertPourposeMap.get(model.cert);
      if (existingPourposeId !== model.pourposeId) {
        return false; // Se troviamo un cert duplicato associato a un pourposeId diverso, restituiamo false
      }
    }
  }

  return true; // Se non ci sono cert duplicati associati a pourposeId diversi, restituiamo true
}