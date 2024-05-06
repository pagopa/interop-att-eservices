import { ErrorHandling, UserModel } from "pdnd-models";
import { TipoParametriRicercaAR001 } from "../model/domain/models.js";
import { userModelNotFound } from "../exceptions/errors.js";

/* eslint-disable */
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

  // Creiamo una nuova copia dell'array esistente
  const newArray = existingArray.slice();

  // Creiamo un set per tenere traccia degli UUID dei modelli esistenti
  const uuidSet = new Set(
    newArray.map((model) => model.soggetto.codiceFiscale)
  );

  // Aggiungiamo solo i nuovi UserModel che non esistono già nell'array esistente
  for (const modelToAdd of modelsToAdd) {
    // Verifichiamo se il UserModel è già presente nell'array esistente
    if (!uuidSet.has(modelToAdd.soggetto.codiceFiscale)) {
      // Se non esiste, lo aggiungiamo all'array e aggiorniamo il set degli UUID
      newArray.push(modelToAdd);
      uuidSet.add(modelToAdd.soggetto.codiceFiscale);
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
    throw userModelNotFound();
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
export function findUserModelByPersonalInfo(
  existingArray: UserModel[] | null,
  pm: TipoParametriRicercaAR001
): UserModel[] {
  // Verifica se l'array esistente è nullo o undefined
  if (!existingArray) {
    throw new Error("L'array esistente deve essere definito.");
  }

  const userModelFound: UserModel[] = [];

  // Cerca UserModel con lo stesso codice fiscale all'interno dell'array esistente
  for (const userModel of existingArray) {
    if (
      userModel.soggetto.nome !== pm.nome ||
      userModel.soggetto.cognome !== pm.cognome ||
      userModel.soggetto.sesso !== pm.sesso ||
      userModel.soggetto.datiNascita.dataEvento !==
        pm.datiNascita?.dataEvento ||
      userModel.soggetto.datiNascita.luogoNascita.comune.nomeComune !==
        pm.datiNascita?.luogoNascita?.comune?.nomeComune ||
      userModel.soggetto.datiNascita.luogoNascita.localita.codiceStato !==
        pm.datiNascita?.luogoNascita?.localita?.codiceStato
    ) {
      continue;
    }

    userModelFound.push(userModel);
  }

  return userModelFound;
}

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

