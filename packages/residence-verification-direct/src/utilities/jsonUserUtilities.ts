import { UserModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";

export function parseJsonToUser(inputString: string | null): UserModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as UserModel;
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
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
      throw new Error("The JSON string does not represent an array");
    }

    return parsedArray.map(
      (item: UserModel) => classToPlain(item) as UserModel
    );
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    return null;
  }
}
