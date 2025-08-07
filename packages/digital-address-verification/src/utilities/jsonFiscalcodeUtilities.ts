import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";

export function parseJsonToResponseRequestDigitalAddress(
  inputString: string | null
): ResponseRequestDigitalAddressModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    const parsedObject = JSON.parse(inputString);

    return classToPlain(parsedObject) as ResponseRequestDigitalAddressModel;
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}

export function parseJsonToResponseRequestDigitalAddressArray(
  inputString: string | null
): ResponseRequestDigitalAddressModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }

    const parsedArray = JSON.parse(inputString);

    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    return parsedArray.map(
      (item: ResponseRequestDigitalAddressModel) =>
        classToPlain(item) as ResponseRequestDigitalAddressModel
    );
  } catch (error) {
    logger.error(`Errore durante il parsing della stringa JSON: ${error}`);
    return null;
  }
}

/* eslint-disable */
export function convertStringToRichiesta(
  jsonString: any
): ResponseRequestDigitalAddressModel {
  try {
    const parsed = JSON.parse(jsonString);

    return {
      idSubject: parsed.idSubject,
      from: parsed.from,
      digitalAddress: parsed.digitalAddress.map((item: any) => ({
        digitalAddress: item.digitalAddress,
        profession: item.profession,
        information: {
          reason: item.information.reason,
          endDate: item.information.endDate,
        },
      })),
    };
  } catch (error) {
    console.error(`Error parsing JSON string: ${error}`);
    throw error;
  }
}
/* eslint-enable */
