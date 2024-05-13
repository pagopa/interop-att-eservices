import { FiscalcodeModel } from "pdnd-models";
import { DataPreparationResponse, DatapreparationTemplate } from "./models.js";


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
  
  



  