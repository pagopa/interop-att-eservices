import { FiscalcodeModel } from "pdnd-models";
import {
  DataPreparationResponse,
  DatapreparationTemplate,
  VerificaCodiceFiscale,
} from "./models.js";

export const apiDatapreparationTemplateToFiscalcodeModel = (
  template: DatapreparationTemplate | undefined
): FiscalcodeModel => ({
  fiscalCode: template?.idSubject || "",
});

/* export const apiFiscalcodeModelToDataPreparationResponse = (
  fiscalCodes: FiscalcodeModel[] | undefined
): DataPreparationResponse => {
  const response: DataPreparationResponse = [];

  if (fiscalCodes) {
    fiscalCodes.forEach((fiscalCode) => {
      response.push({ codiceFiscale: fiscalCode.fiscalCode });
    });
  }

  return response;
}; */
export const apiFiscalcodeModelToDataPreparationResponse = (
  fiscalCodes: FiscalcodeModel[] | undefined
): DataPreparationResponse =>
  fiscalCodes?.map((fiscalCode) => ({
    idSubject: fiscalCode.fiscalCode,
  })) || [];
export const fiscalcodeModelToVerificaCodiceFiscale = (
  fiscalCode: FiscalcodeModel | undefined | null,
  isValid: boolean,
  message: string,
  fiscalCodeNotFound?: string
): VerificaCodiceFiscale | null => {
  if (fiscalCode !== undefined && fiscalCode !== null) {
    return {
      idSubject: fiscalCode.fiscalCode || "",
      valid: isValid,
      message: message,
    };
  } else {
    return {
      idSubject: fiscalCodeNotFound,
      valid: isValid,
      message: message,
    };
  }
};
