import { z } from "zod";
import * as api from "../generated/api.js";

// --- COMUNI / AR001 ---
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
export type TipoLocalitaEstera1 = z.infer<
  typeof api.schemas.TipoLocalitaEstera1
>;
export type TipoResidenza = z.infer<typeof api.schemas.TipoResidenza>;
export type TipoDatiNascitaE000 = z.infer<
  typeof api.schemas.TipoDatiNascitaE000
>;
export type TipoParametriRicercaAR001 = z.infer<
  typeof api.schemas.TipoParametriRicercaAR001
>;
export type TipoRichiestaAR001 = z.infer<typeof api.schemas.TipoRichiestaAR001>;
export type RichiestaAR001 = z.infer<typeof api.schemas.RichiestaAR001>;
export type TipoCodiceFiscale = z.infer<typeof api.schemas.TipoCodiceFiscale>;
export type TipoLuogoEvento = z.infer<typeof api.schemas.TipoLuogoEvento>;
export type TipoIdSchedaSoggettoComune = z.infer<
  typeof api.schemas.TipoIdSchedaSoggettoComune
>;
export type TipoGeneralita = z.infer<typeof api.schemas.TipoGeneralita>;
export type TipoIdentificativi = z.infer<typeof api.schemas.TipoIdentificativi>;
export type TipoAtto = z.infer<typeof api.schemas.TipoAtto>;
export type TipoAttoANSC = z.infer<typeof api.schemas.TipoAttoANSC>;
export type TipoAttoEvento = z.infer<typeof api.schemas.TipoAttoEvento>;
export type TipoDatiEvento = z.infer<typeof api.schemas.TipoDatiEvento>;
export type TipoDatiSoggettiEnte = z.infer<
  typeof api.schemas.TipoDatiSubjectsEnte
>;
export type TipoListaSoggetti = z.infer<typeof api.schemas.TipoListaSubjects>;
export type TipoErroriAnomalia = z.infer<typeof api.schemas.TipoErroriAnomalia>;
export type RispostaAR001 = z.infer<typeof api.schemas.RispostaAR001>;
export type ProblemError = z.infer<typeof api.schemas.ProblemError>;
export type Problem = z.infer<typeof api.schemas.Problem>;

export type RichiestaAR002 = z.infer<typeof api.schemas.RichiestaAR002>;
export type RispostaAR002OK = z.infer<typeof api.schemas.RispostaAR002OK>;
export type InfoSoggettoItemAR002 = z.infer<
  typeof api.schemas.InfoSoggettoItemAR002
>;
