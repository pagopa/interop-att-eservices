import { PartitaIvaModel } from "pdnd-models";
import { pivaNotFound } from "../exceptions/errors.js";

/* eslint-disable */
export function appendUniquePivaModelsToArray(
  existingArray: PartitaIvaModel[] | null,
  modelsToAdd: PartitaIvaModel[] | null
): PartitaIvaModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  const newArray = existingArray.slice();

  const modelMap = new Map<string, PartitaIvaModel>();
  for (const model of newArray) {
    modelMap.set(model.organizationId, model);
  }

  for (const modelToAdd of modelsToAdd) {
    const existingModel = modelMap.get(modelToAdd.organizationId);
    if (existingModel) {
      Object.assign(existingModel, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }

  return newArray;
}

export function findPivaModelByPiva(
  pivas: PartitaIvaModel[] | null,
  piva: string
): PartitaIvaModel | null {
  if (pivas == null) return null;
  for (const pivaModel of pivas) {
    if (pivaModel.organizationId === piva) {
      return pivaModel;
    }
  }
  return null;
}

export function deletePivaModelByPiva(
  existingArray: PartitaIvaModel[] | null,
  piva: string
): PartitaIvaModel[] | null {
  if (!existingArray) {
    throw pivaNotFound();
  }
  const result: PartitaIvaModel[] = [];

  for (const pivaM of existingArray) {
    if (pivaM.organizationId !== piva) {
      result.push(pivaM);
    }
  }

  return result;
}

export const arePartitaIvasValid = (
  partitaIvaList: PartitaIvaModel[]
): boolean => {
  return partitaIvaList.every((item) => {
    const parsedItem = PartitaIvaModel.safeParse(item);
    return parsedItem.success && parsedItem.data.organizationId.length > 5;
  });
};
