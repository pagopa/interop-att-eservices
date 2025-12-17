import { v4 as uuidv4 } from "uuid";
import { InfoSoggettoEnte, TipoInfoSoggetto } from "../model/internal-model.js";
/* eslint-disable */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

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

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function checkInfoSoggettoEquals(
  obj1: any,
  obj2: any
): InfoSoggettoEnte | {} {
  const response: InfoSoggettoEnte = {
    infoInstitution: [] as TipoInfoSoggetto[],
  };
  const listObj: TipoInfoSoggetto[] = [];

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

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      listObj.push({
        id: uuidv4(),
        chiave: key,
        valore: "A",
        valoreTesto: "",
        valoreData: formattedDate,
        dettaglio: "-",
      });
    } else if (!deepEqual(obj1[key], obj2[key])) {
      listObj.push({
        id: uuidv4(),
        chiave: key,
        valore: "N",
        valoreTesto: obj2[key],
        valoreData: formattedDate,
        dettaglio: "-",
      });
    } else {
      listObj.push({
        id: uuidv4(),
        chiave: key,
        valore: "S",
        valoreTesto: obj2[key],
        valoreData: formattedDate,
        dettaglio: "-",
      });
    }
  }

  response.infoInstitution?.push(...listObj);
  return response;
}

/* eslint-enable */
