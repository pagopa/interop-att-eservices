import { HandshakeModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "../index.js";

export function parseJsonToHandshake(
  inputString: string | null
): HandshakeModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);
    return classToPlain(parsedObject) as HandshakeModel;
  } catch (error) {
    logger.error(`Error while parsing the JSON string: ${error}`);
    return null;
  }
}

export function parseJsonToHandshakeArray(
  inputString: string | null
): HandshakeModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedArray = JSON.parse(inputString);

    if (!Array.isArray(parsedArray)) {
      throw new Error("The JSON string does not represent an array");
    }

    return parsedArray.map(
      (item: HandshakeModel) => classToPlain(item) as HandshakeModel
    );
  } catch (error) {
    logger.error(`Error while parsing the JSON string: ${error}`);
    return null;
  }
}
