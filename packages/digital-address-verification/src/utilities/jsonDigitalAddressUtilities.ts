import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { RequestListDigitalAddress } from "../model/domain/models.js";

export function parseJsonToRequestListDigitalAddress(
  inputString: string | null
): RequestListDigitalAddress | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as RequestListDigitalAddress;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}
