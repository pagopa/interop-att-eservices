import { ErrorHandling, UserModel } from "pdnd-models";

// Funzione che aggiunge una lista di UserModel a un array esistente solo se non esistono già, sostituendo eventuali duplicati
export function appendUniqueUserModelsToArray(
  existingArray: UserModel[] | null,
  modelsToAdd: UserModel[] | null
): UserModel[] {
  // Verifica se l'array esistente o la lista dei modelli da aggiungere sono nulli o undefined
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }

  // Copia l'array esistente per non modificarlo direttamente
  const newArray = existingArray.slice();

  // Aggiunge solo i nuovi UserModel che non esistono già nell'array esistente
  for (const modelToAdd of modelsToAdd) {
    // Cerca se esiste già un UserModel con lo stesso codice fiscale nell'array esistente
    const existingModelIndex = newArray.findIndex(
      (model) =>
        model.soggetto.codiceFiscale === modelToAdd.soggetto.codiceFiscale
    );
    if (existingModelIndex !== -1) {
      // Se esiste già un UserModel con lo stesso codice fiscale, aggiorna l'UUID dell'elemento da sostituire
      modelToAdd.uuid = newArray[existingModelIndex].uuid;
      // Sostituisci l'elemento esistente con il nuovo UserModel
      newArray.splice(existingModelIndex, 1, modelToAdd);
    } else {
      // Se non esiste già un UserModel con lo stesso codice fiscale, aggiungi il nuovo UserModel
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function getUserModelByCodiceFiscale(
  userModels: UserModel[],
  codiceFiscale: string
): UserModel | null {
  // Verifica se l'array di UserModel è definito e non vuoto
  if (!userModels || userModels.length === 0) {
    throw new Error(
      "La lista di UserModel non può essere vuota o non definita."
    );
  }

  // Cerca l'UserModel con il codice fiscale specificato
  const userModel = userModels.find(
    (model) => model.soggetto.codiceFiscale === codiceFiscale
  );

  return userModel || null; // Torna l'UserModel trovato o null se non trovato
}

// Funzione che cerca un UserModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function findUserModelByFiscalCode(
  existingArray: UserModel[] | null,
  codiceFiscale: string
): UserModel | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw new Error("L'array esistente deve essere definito.");
  }

  let userModelFound: UserModel | null = null; // Inizializza la variabile per memorizzare l'oggetto UserModel trovato

  // Cerca UserModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const userModel of existingArray) {
    if (userModel.soggetto.codiceFiscale === codiceFiscale) {
      userModelFound = userModel;
      break; // Interrompi il ciclo una volta trovato il UserModel
    }
  }

  return userModelFound; // Restituisci l'oggetto UserModel trovato, se presente
}

// Funzione che cerca un UserModel all'interno di un array esistente utilizzando l'id come criterio di ricerca
export function findUserModelById(
  existingArray: UserModel[] | null,
  id: string
): UserModel | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw new Error("L'array esistente deve essere definito.");
  }

  let userModelFound: UserModel | null = null; // Inizializza la variabile per memorizzare l'oggetto UserModel trovato

  // Cerca UserModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const userModel of existingArray) {
    if (userModel.soggetto.id === id) {
      userModelFound = userModel;
      break; // Interrompi il ciclo una volta trovato il UserModel
    }
  }

  return userModelFound; // Restituisci l'oggetto UserModel trovato, se presente
}

// Funzione che cerca un UserModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function findUserModelByUUID(
  existingArray: UserModel[] | null,
  uuid: string
): UserModel | null {
  if (!existingArray) {
    throw ErrorHandling.genericError();
  }

  for (const userModel of existingArray) {
    if (userModel.uuid === uuid) {
      return userModel;
    }
  }

  return null;
}

// Funzione che cerca un UserModel all'interno di un array esistente utilizzando il codice fiscale o l'UUID come criterio di ricerca
export function findUserModelByFiscalCodeOrUUID(
  existingArray: UserModel[] | null,
  searchKey: string
): UserModel | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw new Error("L'array esistente deve essere definito.");
  }

  let userModelFound: UserModel | null = null; // Inizializza la variabile per memorizzare l'oggetto UserModel trovato

  // Cerca UserModel con lo stesso codice fiscale o UUID all'interno dell'array esistente
  for (const userModel of existingArray) {
    if (
      userModel.soggetto.codiceFiscale === searchKey ||
      userModel.uuid === searchKey
    ) {
      userModelFound = userModel;
      break; // Interrompi il ciclo una volta trovato il UserModel
    }
  }

  return userModelFound; // Restituisci l'oggetto UserModel trovato, se presente
}

// Funzione che cerca un UserModel all'interno di un array esistente utilizzando il codice fiscale come criterio di ricerca
export function deleteUserModelByUUID(
  existingArray: UserModel[] | null,
  uuid: string
): UserModel[] | null {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw new Error("L'array esistente deve essere definito.");
  }
  const result: UserModel[] = [];

  // Cerca UserModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const userModel of existingArray) {
    if (userModel.uuid !== uuid) {
      result.push(userModel);
    }
  }

  return result; // Restituisci l'oggetto UserModel trovato, se presente
}
