import { UserModel } from "pdnd-models";
import { TipoParametriRicercaAR001 } from "../model/modelAr001.js";
import { userModelNotFound } from "../exceptions/errors.js";
/* eslint-disable */

export function appendUniqueUserModelsToArray(
  existingArray: UserModel[] | null,
  modelsToAdd: UserModel[] | null
): UserModel[] {
  if (!existingArray || !modelsToAdd) {
    throw new Error(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  }
  const newArray = existingArray.slice();
  for (const modelToAdd of modelsToAdd) {
    const existingModelIndex = newArray.findIndex(
      (model) => model.subject.subjectId === modelToAdd.subject.subjectId
    );
    if (existingModelIndex !== -1) {
      modelToAdd.uuid = newArray[existingModelIndex].uuid;
      newArray.splice(existingModelIndex, 1, modelToAdd);
    } else {
      newArray.push(modelToAdd);
    }
  }
  return newArray;
}

export function getUserModelByCodiceFiscale(
  userModels: UserModel[],
  subjectId: string
): UserModel | null {
  if (!userModels || userModels.length === 0) {
    throw new Error(
      "La lista di UserModel non può essere vuota o non definita."
    );
  }
  const userModel = userModels.find(
    (model) => model.subject.subjectId === subjectId
  );
  return userModel || null;
}

export function findUserModelBySubjectId(
  existingArray: UserModel[] | null,
  subjectId: string
): UserModel | null {
  if (!existingArray) {
    throw userModelNotFound();
  }
  let userModelFound: UserModel | null = null;
  for (const userModel of existingArray) {
    if (userModel.subject.subjectId === subjectId) {
      userModelFound = userModel;
      break;
    }
  }
  return userModelFound;
}

export function findUserModelByPersonalInfo(
  existingArray: UserModel[] | null,
  pm: TipoParametriRicercaAR001
): UserModel[] {
  if (!existingArray) {
    throw userModelNotFound();
  }
  const userModelFound: UserModel[] = [];
  for (const userModel of existingArray) {
    if (
      userModel.subject.name !== pm.name ||
      userModel.subject.surname !== pm.surname ||
      userModel.subject.gender !== pm.gender ||
      userModel.subject.birthDate.eventDate !== pm.birthDate?.eventDate ||
      userModel.subject.birthDate.birthPlace.municipality.nameMunicipality !==
        pm.birthDate?.birthPlace?.municipality?.nameMunicipality ||
      userModel.subject.birthDate.birthPlace.place.codState !==
        pm.birthDate?.birthPlace?.place?.codState
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
  if (!existingArray) {
    throw userModelNotFound();
  }
  let userModelFound: UserModel | null = null;
  for (const userModel of existingArray) {
    if (userModel.subject.id === id) {
      userModelFound = userModel;
      break;
    }
  }
  return userModelFound;
}

export function findUserModelByUUID(
  existingArray: UserModel[] | null,
  uuid: string
): UserModel | null {
  if (!existingArray) {
    throw userModelNotFound();
  }
  for (const userModel of existingArray) {
    if (userModel.uuid === uuid) {
      return userModel;
    }
  }
  return null;
}

export function findUserModelBySubjectIdOrUUID(
  existingArray: UserModel[] | null,
  searchKey: string
): UserModel | null {
  if (!existingArray) {
    throw userModelNotFound();
  }
  let userModelFound: UserModel | null = null;
  for (const userModel of existingArray) {
    if (
      userModel.subject.subjectId === searchKey ||
      userModel.uuid === searchKey
    ) {
      userModelFound = userModel;
      break;
    }
  }
  return userModelFound;
}
export function deleteUserModelByUUID(
  existingArray: UserModel[] | null,
  uuid: string
): UserModel[] | null {
  if (!existingArray) {
    throw userModelNotFound();
  }
  const result: UserModel[] = [];
  for (const userModel of existingArray) {
    if (userModel.uuid !== uuid) {
      result.push(userModel);
    }
  }
  return result;
}
/* eslint-enable */
