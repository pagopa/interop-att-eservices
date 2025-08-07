import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { ResponseRequestDigitalAddress } from "../model/domain/models.js";

export function parseJsonToVerifyRequest(
  inputString: string | null
): VerifyRequest | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as VerifyRequest;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}

export function parseJsonToVerifyRequestArray(
  inputString: string | null
): VerifyRequest[] | null {
  try {
    if (inputString == null) {
      return null;
    }

    const parsedArray = JSON.parse(inputString);

    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    return parsedArray.map(
      (item: VerifyRequest) => classToPlain(item) as VerifyRequest
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}

/* eslint-disable */
export function convertStringToVerifyRequest(jsonString: any): VerifyRequest {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    return {
      idRequest: parsed.idRequest,
      jsonRequest: parsed.jsonRequest,
      count: parsed.count,
    };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}

/* eslint-disable */
export function convertStringToResponseRequestDigitalAddress(
  jsonString: any
): ResponseRequestDigitalAddress {
  /* eslint-enable */
  try {
    const parsed = JSON.parse(jsonString);

    return {
      digitalAddress: parsed.digitalAddress,
      idSubject: parsed.idSubject,
      from: parsed.from,
    };
  } catch (error) {
    logger.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
