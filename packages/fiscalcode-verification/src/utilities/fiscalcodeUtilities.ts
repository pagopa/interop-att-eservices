import { FiscalcodeModel } from "pdnd-models";
import { fiscalcodeNotFound } from "../exceptions/errors.js";

/* eslint-disable */
export function appendUniqueFiscalcodeModelsToArray(
  existingArray: FiscalcodeModel[] | null,
  modelsToAdd: FiscalcodeModel[] | null
): FiscalcodeModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }

  const newArray = existingArray.slice();

  const modelMap = new Map<string, FiscalcodeModel>();
  for (const model of newArray) {
    modelMap.set(model.fiscalCode, model);
  }

  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.fiscalCode);
    if (existingModel) {
      Object.assign(existingModel, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findFiscalcodeModelByFiscalcode(
  fiscalCodes: FiscalcodeModel[] | null,
  fiscalCode: string
): FiscalcodeModel | null {
  if (fiscalCodes == null) return null;
  for (const fiscalCodeModel of fiscalCodes) {
    if (fiscalCodeModel.fiscalCode === fiscalCode) {
      return fiscalCodeModel;
    }
  }
  return null;
}

export function deleteFiscalcodeModelByFiscaldode(
  existingArray: FiscalcodeModel[] | null,
  fiscalCode: string
): FiscalcodeModel[] | null {
  if (!existingArray) {
    throw fiscalcodeNotFound();
  }
  const result: FiscalcodeModel[] = [];

  for (const fiscalCodeM of existingArray) {
    if (fiscalCodeM.fiscalCode !== fiscalCode) {
      result.push(fiscalCodeM);
    }
  }

  return result;
}

export const areFiscalCodesValid = (
  fiscalCodeList: FiscalcodeModel[]
): boolean => {
  return fiscalCodeList.every((item) => {
    const parsedItem = FiscalcodeModel.safeParse(item);
    return parsedItem.success && parsedItem.data.fiscalCode.length > 5;
  });
};
