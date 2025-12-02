import { z } from "zod";
import * as api from "../generated/api.js";

export type TipoLocalita = z.infer<typeof api.schemas.TipoLocalita>;
export type TipoComune = z.infer<typeof api.schemas.TipoComune>;
export type TipoLuogoNascitaE000 = z.infer<
  typeof api.schemas.TipoLuogoNascitaE000
>;
export type TipoToponimo = z.infer<typeof api.schemas.TipoToponimo>;
export type TipoCivicoInterno = z.infer<typeof api.schemas.TipoCivicoInterno>;
export type TipoNumeroCivico = z.infer<typeof api.schemas.TipoNumeroCivico>;
export type TipoIndirizzo = z.infer<typeof api.schemas.TipoIndirizzo>;
export type TipoDatoLocalitaEstera = z.infer<
  typeof api.schemas.TipoDatoLocalitaEstera
>;
export type TipoToponimoEstero = z.infer<typeof api.schemas.TipoToponimoEstero>;
export type TipoIndirizzoEsterxo = z.infer<
  typeof api.schemas.TipoIndirizzoEstero
>;
export type TipoConsolato = z.infer<typeof api.schemas.TipoConsolato>;
export type TipoDatiNascitaE000 = z.infer<
  typeof api.schemas.TipoDatiNascitaE000
>;
export type TipoVerificaResidenza = z.infer<
  typeof api.schemas.TipoVerificaResidenza
>;
export type TipoLocalitaEstera = z.infer<typeof api.schemas.TipoLocalitaEstera>;
export type InfoSoggettoEnte = z.infer<typeof api.schemas.InfoSoggettoEnte>;
export type TipoInfoSoggetto = z.infer<typeof api.schemas.TipoInfoSoggetto>;
export type TipoErroriAnomalia = z.infer<typeof api.schemas.TipoErroriAnomalia>;
export type RichiestaAR002 = z.infer<typeof api.schemas.RichiestaAR002>;
export type RispostaAR002OK = z.infer<typeof api.schemas.RispostaAR002OK>;
export type ProblemError = z.infer<typeof api.schemas.ProblemError>;
export type Problem = z.infer<typeof api.schemas.Problem>;
