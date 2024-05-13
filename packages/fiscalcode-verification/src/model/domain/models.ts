import { z } from "zod";
import * as api from "../generated/api.js";

export type DatapreparationTemplate = z.infer<
  typeof api.schemas.DatapreparationTemplate
>;

export type DataPreparationResponse = z.infer<
  typeof api.schemas.DataPreparationResponse
>;
export type CodiceFiscale = z.infer<
  typeof api.schemas.CodiceFiscale
>;
