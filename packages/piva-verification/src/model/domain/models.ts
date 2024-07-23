import { z } from "zod";
import * as api from "../generated/api.js";

export type DatapreparationTemplate = z.infer<
  typeof api.schemas.DatapreparationTemplate
>;

export type DataPreparationResponse = z.infer<
  typeof api.schemas.DataPreparationResponse
>;
export type PartitaIva = z.infer<typeof api.schemas.OrganizationId>;
export type Richiesta = z.infer<typeof api.schemas.Richiesta>;
export type VerificaPartitaIva = z.infer<typeof api.schemas.VerificaOrganizationId>;
