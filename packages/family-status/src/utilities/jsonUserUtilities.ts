import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { UserModel } from "../model/domain/models.js";

export function parseJsonToUser(inputString: string | null): UserModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as UserModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}
export function parseJsonToUserArray(
  inputString: string | null
): UserModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedArray = JSON.parse(inputString);

    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    return parsedArray.map(
      (item: UserModel) => classToPlain(item) as UserModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}
