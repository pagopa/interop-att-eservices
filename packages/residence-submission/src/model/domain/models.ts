import { z } from "zod";
import * as api from "../generated/api.js";

export type RichiestaAR003 = z.infer<typeof api.schemas.RichiestaAR003>;
export type SoggettoAR003 = z.infer<typeof api.schemas.SoggettoAR003>;
export type DatiNascitaAR003 = z.infer<typeof api.schemas.DatiNascitaAR003>;
export type ResidenzaAR003 = z.infer<typeof api.schemas.ResidenzaAR003>;
export type IndirizzoCompletoAR003 = z.infer<
  typeof api.schemas.IndirizzoCompletoAR003
>;
export type ToponimoAR003 = z.infer<typeof api.schemas.ToponimoAR003>;
export type NumeroCivicoAR003 = z.infer<typeof api.schemas.NumeroCivicoAR003>;
export type CivicoInternoAR003 = z.infer<typeof api.schemas.CivicoInternoAR003>;
export type LocalitaEsteraAR003 = z.infer<
  typeof api.schemas.LocalitaEsteraAR003
>;
export type ComuneAR003 = z.infer<typeof api.schemas.ComuneAR003>;
export type LocalitaAR003 = z.infer<typeof api.schemas.LocalitaAR003>;

export const ProblemErrorSchema = z
  .object({
    code: z.string(),
    detail: z.string(),
  })
  .passthrough();
export type ProblemError = z.infer<typeof ProblemErrorSchema>;

export const ProblemSchema = z
  .object({
    type: z.string(),
    status: z.number().int(),
    title: z.string(),
    correlationId: z.string().optional(),
    detail: z.string(),
    errors: z.array(ProblemErrorSchema).min(1),
  })
  .passthrough();
export type Problem = z.infer<typeof ProblemSchema>;
