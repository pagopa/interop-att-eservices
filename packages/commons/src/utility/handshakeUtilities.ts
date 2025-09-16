import { HandshakeModel } from "../db/model/handshake.js";

export function appendUniqueHandshakeModelsToArray(
  existingArray: HandshakeModel[] | null,
  modelsToAdd: HandshakeModel[] | null
): HandshakeModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "The existing array and the list of models to add must be defined."
    );
  }

  const existingMap = new Map<string, HandshakeModel>(
    existingArray.map((model) => [model.apikey, { ...model }])
  );

  for (const modelToAdd of modelsToAdd) {
    if (existingMap.has(modelToAdd.apikey)) {
      existingMap.set(modelToAdd.apikey, {
        ...existingMap.get(modelToAdd.apikey),
        ...modelToAdd,
      });
    } else {
      existingMap.set(modelToAdd.apikey, { ...modelToAdd });
    }
  }

  return Array.from(existingMap.values());
}

export function findHandshakeModelByApikey(
  handshakes: HandshakeModel[] | null,
  apikey: string
): HandshakeModel | null {
  if (handshakes == null) {
    return null;
  }
  for (const handshake of handshakes) {
    if (handshake.apikey === apikey) {
      return { ...handshake };
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

  const existingCertApikeyMap = new Map<string, string>();

  for (const model of existingArray) {
    if (model.cert) {
      existingCertApikeyMap.set(model.cert, model.apikey);
    }
  }

  for (const model of modelsToAdd) {
    if (model.cert && existingCertApikeyMap.has(model.cert)) {
      const existingApikey = existingCertApikeyMap.get(model.cert);
      if (existingApikey !== model.apikey) {
        return false;
      }
    }
  }

  return true;
}
