import { z } from "zod";
import * as api from "../generated/api.js";

export type PaginatedTrialResponse = z.infer<
  typeof api.schemas.PaginatedTrialResponse
>;
export type PaginatedTrials = z.infer<typeof api.schemas.PaginatedTrials>;
export type PaginatedTrialItem = z.infer<typeof api.schemas.PaginatedTrialItem>;
export type CheckResponse = z.infer<typeof api.schemas.CheckResponse>;
export type CategoryResponse = z.infer<typeof api.schemas.CategoryResponse>;
