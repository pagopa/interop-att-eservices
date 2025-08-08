import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { fiscalcodeNotFound } from "../exceptions/errors.js";

/* eslint-disable */

export function appendUniqueFiscalcodeModelsToArray(
  existingArray: ResponseRequestDigitalAddressModel[] | null,
  modelsToAdd: ResponseRequestDigitalAddressModel[] | null
): ResponseRequestDigitalAddressModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }

  const newArray = existingArray.slice();

  const modelMap = new Map<string, ResponseRequestDigitalAddressModel>();
  for (const model of newArray) {
    modelMap.set(model.idSubject, model);
  }

  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.idSubject);
    if (existingModel) {
      Object.assign(existingModel, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findFiscalcodeModelByFiscalcode(
  fiscalCodes: ResponseRequestDigitalAddressModel[] | null,
  fiscalCode: string
): ResponseRequestDigitalAddressModel | null {
  if (fiscalCodes == null) return null;
  for (const fiscalCodeModel of fiscalCodes) {
    if (fiscalCodeModel.idSubject == fiscalCode) {
      return fiscalCodeModel;
    }
  }
  return null;
}

export function deleteFiscalcodeModelByFiscaldode(
  existingArray: ResponseRequestDigitalAddressModel[] | null,
  fiscalCode: string
): ResponseRequestDigitalAddressModel[] | null {
  if (!existingArray || existingArray.length === 0) {
    throw fiscalcodeNotFound();
  }
  const result: ResponseRequestDigitalAddressModel[] = [];

  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.idSubject !== fiscalCode) {
      result.push(fiscalCodeM);
    }
  }

  return result;
}
