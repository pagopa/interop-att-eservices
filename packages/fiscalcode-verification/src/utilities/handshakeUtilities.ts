import { HandshakeModel } from "pdnd-models";

/* eslint-disable */
export function appendUniqueHandshakeModelsToArray(
  existingArray: HandshakeModel[] | null,
  modelsToAdd: HandshakeModel[] | null
): HandshakeModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  const newArray = existingArray.slice();

  const modelMap = new Map<string, HandshakeModel>();
  for (const model of newArray) {
    modelMap.set(model.apikey, model);
  }

  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.apikey);
    if (existingModel) {
      Object.assign(existingModel, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findHandshakeModelByapikey(
  handshakes: HandshakeModel[] | null,
  apikey: string
): HandshakeModel | null {
  if (handshakes == null) return null;
  for (const handshake of handshakes) {
    if (handshake.apikey === apikey) {
      return handshake;
    }
  }
  return null;
}

export function isCertUnique(
  existingArray: HandshakeModel[] | null,
  modelsToAdd: HandshakeModel[] | null
): boolean {
  if (!existingArray || !modelsToAdd) {
    return true;
  }

  const existingCertPourposeMap = new Map<string, string>();

  for (const model of existingArray) {
    existingCertPourposeMap.set(model.cert, model.apikey);
  }

  for (const model of modelsToAdd) {
    if (existingCertPourposeMap.has(model.cert)) {
      const existingapikey = existingCertPourposeMap.get(model.cert);
      if (existingapikey !== model.apikey) {
        return false;
      }
    }
  }

  return true;
}
