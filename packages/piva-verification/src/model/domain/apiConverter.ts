import { PartitaIvaModel } from "pdnd-models";
import {
  DataPreparationResponse,
  DatapreparationTemplate,
  VerificaPartitaIva,
} from "./models.js";

export const apiDatapreparationTemplateToPivaModel = (
  template: DatapreparationTemplate | undefined
): PartitaIvaModel => ({
  organizationId: template?.organizationId || "",
});

export const apiPartitaIvaModelToDataPreparationResponse = (
  partitaIvas: PartitaIvaModel[] | undefined
): DataPreparationResponse =>
  partitaIvas?.map((partitaIva) => ({
    organizationId: partitaIva.organizationId,
  })) || [];

export const partitaIvaModelToVerificaPartitaIva = (
  partitaIva: PartitaIvaModel | undefined | null,
  isValid: boolean,
  message: string,
  partitaIvaNotFound?: string
): VerificaPartitaIva | null => {
  if (partitaIva !== undefined && partitaIva !== null) {
    return {
      organizationId: partitaIva.organizationId || "",
      valid: isValid,
      message: message,
    };
  } else {
    return {
      organizationId: partitaIvaNotFound,
      valid: isValid,
      message: message,
    };
  }
};
