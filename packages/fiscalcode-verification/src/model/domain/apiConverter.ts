import { FiscalcodeModel } from "pdnd-models";
import { DataPreparationResponse, DatapreparationTemplate, VerificaCodiceFiscale } from "./models.js";


export const apiDatapreparationTemplateToFiscalcodeModel = (
    template: DatapreparationTemplate | undefined
  ): FiscalcodeModel => ({
    fiscalCode: template?.codiceFiscale || ""
  });

  export const apiFiscalcodeModelToDataPreparationResponse = (
    fiscalCodes: FiscalcodeModel[] | undefined
  ): DataPreparationResponse => {
    const response: DataPreparationResponse = [];
  
    if (fiscalCodes) {
      fiscalCodes.forEach((fiscalCode) => {
        response.push({ codiceFiscale: fiscalCode.fiscalCode });
      });
    }
  
    return response;
  };
  
  export const fiscalcodeModelToVerificaCodiceFiscale = (
    fiscalCode: FiscalcodeModel | undefined | null, isValid: boolean, message: string, fiscalCodeNotFound?: string
  ): VerificaCodiceFiscale | null => {
    if (fiscalCode !== undefined && fiscalCode !== null) {
      return {
        fiscalCode: fiscalCode.fiscalCode || "",
        valido: isValid,
        messaggio: message
      };
    } else {
      return {
        fiscalCode: fiscalCodeNotFound,
        valido: isValid,
        messaggio: message
      };
    }
  };
  

  