import { PartitaIvaModel } from "pdnd-models";
import {
  DataPreparationResponse,
  DatapreparationTemplate,
  VerificaPartitaIva,
} from "./models.js";

export const apiDatapreparationTemplateToPivaModel = (
  template: DatapreparationTemplate | undefined
): PartitaIvaModel => ({
  partitaIva: template?.partitaIva || "",
});


export const apiPartitaIvaModelToDataPreparationResponse = (
  partitaIvas: PartitaIvaModel[] | undefined
): DataPreparationResponse =>
  partitaIvas?.map((partitaIva) => ({
    partitaIva: partitaIva.partitaIva,
  })) || [];

export const partitaIvaModelToVerificaPartitaIva = (
  partitaIva : PartitaIvaModel | undefined | null,
  isValid: boolean,
  message: string,
  partitaIvaNotFound?: string
): VerificaPartitaIva | null => {
  if (partitaIva  !== undefined && partitaIva  !== null) {
    return {
      partitaIva: partitaIva.partitaIva || "",
      valido: isValid,
      messaggio: message,
    };
  } else {
    return {
      partitaIva: partitaIvaNotFound,
      valido: isValid,
      messaggio: message,
    };
  }
};
