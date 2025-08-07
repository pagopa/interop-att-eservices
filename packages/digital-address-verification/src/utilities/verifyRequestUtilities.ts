import { fiscalcodeNotFound } from "../exceptions/errors.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";

/* eslint-disable */
export function appendUniqueVerifyRequestToArray(
  existingArray: VerifyRequest[] | null,
  modelsToAdd: VerifyRequest[] | null
): VerifyRequest[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  const newArray = existingArray.slice();

  const modelMap = new Map<string, VerifyRequest>();
  for (const model of newArray) {
    modelMap.set(model.idRequest, model);
  }

  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.idRequest);
    if (existingModel) {
      Object.assign(existingModel, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findRequestlByIdRequest(
  fiscalCodes: VerifyRequest[] | null,
  idRequest: string
): VerifyRequest | null {
  if (fiscalCodes == null) return null;
  for (const fiscalCodeModel of fiscalCodes) {
    if (fiscalCodeModel.idRequest === idRequest) {
      return fiscalCodeModel;
    }
  }
  return null;
}

export function deleteRequestByIdRequest(
  existingArray: VerifyRequest[] | null,
  idRequest: string
): VerifyRequest[] | null {
  if (!existingArray) {
    throw fiscalcodeNotFound();
  }
  const result: VerifyRequest[] = [];

  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.idRequest !== idRequest) {
      result.push(fiscalCodeM);
    }
  }

  return result;
}
