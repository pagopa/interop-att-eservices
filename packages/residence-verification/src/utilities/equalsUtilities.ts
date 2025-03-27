import { v4 as uuidv4 } from "uuid";
import { InfoSoggettoEnte, TipoInfoSoggetto } from "../model/domain/models.js";
/* eslint-disable */
export function deepEqual(obj1: any, obj2: any): boolean {
  // Se sono lo stesso oggetto, sono uguali
  if (obj1 === obj2) {
    return true;
  }

  // Se uno dei due oggetti è null o non è un oggetto, non sono uguali
  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Se il numero di chiavi è diverso, gli oggetti non sono uguali
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Confronto ricorsivo delle chiavi e dei valori degli oggetti
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // Gli oggetti sono uguali
  return true;
}

export function checkInfoSoggettoEquals(obj1: any, obj2: any) {
  const response: InfoSoggettoEnte = {
    infoInstitution: [] as TipoInfoSoggetto[],
  };
  const listObj: TipoInfoSoggetto[] = [];

  // Se uno dei due oggetti è null o non è un oggetto, non sono uguali
  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return {};
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const dateNow: Date = new Date();
  const formattedDate = `${dateNow.getFullYear()}-${
    dateNow.getMonth() + 1
  }-${dateNow.getDate()}`;

  // Confronto ricorsivo delle chiavi e dei valori degli oggetti
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      listObj.push({
        id: uuidv4(),
        key: key,
        value: "A",
        textValue: "",
        dataValue: formattedDate,
        otherData: "-",
      });
    } else if (!deepEqual(obj1[key], obj2[key])) {
      listObj.push({
        id: uuidv4(),
        key: key,
        value: "N",
        textValue: obj2[key],
        dataValue: formattedDate,
        otherData: "-",
      });
    } else {
      listObj.push({
        id: uuidv4(),
        key: key,
        value: "S",
        textValue: obj2[key],
        dataValue: formattedDate,
        otherData: "-",
      });
    }
  }

  // **Aggiunta delle coordinate senza stravolgere il codice**
  const coords1 = obj1?.address?.address?.coords;
  const coords2 = obj2?.address?.address?.coords;

  if (coords2) {
    listObj.push({
      id: uuidv4(),
      key: "coordinates",
      value: coords1 && deepEqual(coords1, coords2) ? "S" : "N",
      textValue: coords2 ? `${coords2.latitude}, ${coords2.longitude}` : "",
      dataValue: formattedDate,
      otherData: "-",
    });
  }

  response.infoInstitution?.push(...listObj);
  return response;
}

/* eslint-enable */
