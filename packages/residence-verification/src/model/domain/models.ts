import { z } from "zod";
import * as api from "../generated/api.js";
import {
  RichiestaAR001,
  RispostaAR001,
  TipoAtto,
  TipoAttoANSC,
  TipoAttoEvento,
  TipoCivicoInterno,
  TipoCodiceFiscale,
  TipoComune,
  TipoConsolato,
  TipoDatiEvento,
  TipoDatiNascitaE000,
  TipoDatoLocalitaEstera,
  TipoErroriAnomalia,
  TipoGeneralita,
  TipoIdentificativi,
  TipoIdSchedaSoggettoComune,
  TipoIndirizzo,
  TipoIndirizzoEstero,
  TipoLocalita,
  TipoLocalitaEstera1,
  TipoLuogoEvento,
  TipoNumeroCivico,
  TipoParametriRicercaAR001,
  TipoResidenza,
  TipoRichiestaAR001,
  TipoToponimo,
  TipoToponimoEstero,
  TipoLuogoNascitaE000,
  TipoDatiSoggettiEnte,
  TipoListaSoggetti,
} from "../modelAr001.js";

export type TipoLocalita = z.infer<typeof TipoLocalita>;
export type TipoComune = z.infer<typeof TipoComune>;
export type TipoLuogoNascitaE000 = z.infer<typeof TipoLuogoNascitaE000>;
export type TipoToponimo = z.infer<typeof TipoToponimo>;
export type TipoCivicoInterno = z.infer<typeof TipoCivicoInterno>;
export type TipoNumeroCivico = z.infer<typeof TipoNumeroCivico>;
export type TipoIndirizzo = z.infer<typeof TipoIndirizzo>;
export type TipoDatoLocalitaEstera = z.infer<typeof TipoDatoLocalitaEstera>;
export type TipoToponimoEstero = z.infer<typeof TipoToponimoEstero>;
export type TipoIndirizzoEstero = z.infer<typeof TipoIndirizzoEstero>;
export type TipoConsolato = z.infer<typeof TipoConsolato>;
export type TipoLocalitaEstera1 = z.infer<typeof TipoLocalitaEstera1>;
export type TipoResidenza = z.infer<typeof TipoResidenza>;
export type TipoDatiNascitaE000 = z.infer<typeof TipoDatiNascitaE000>;
export type TipoParametriRicercaAR001 = z.infer<
  typeof TipoParametriRicercaAR001
>;
export type TipoRichiestaAR001 = z.infer<typeof TipoRichiestaAR001>;
export type RichiestaAR001 = z.infer<typeof RichiestaAR001>;
export type TipoCodiceFiscale = z.infer<typeof TipoCodiceFiscale>;
export type TipoLuogoEvento = z.infer<typeof TipoLuogoEvento>;
export type TipoIdSchedaSoggettoComune = z.infer<
  typeof TipoIdSchedaSoggettoComune
>;
export type TipoGeneralita = z.infer<typeof TipoGeneralita>;
export type TipoIdentificativi = z.infer<typeof TipoIdentificativi>;
export type TipoAtto = z.infer<typeof TipoAtto>;
export type TipoAttoANSC = z.infer<typeof TipoAttoANSC>;
export type TipoAttoEvento = z.infer<typeof TipoAttoEvento>;
export type TipoDatiEvento = z.infer<typeof TipoDatiEvento>;
export type TipoDatiSoggettiEnte = z.infer<typeof TipoDatiSoggettiEnte>;
export type TipoListaSoggetti = z.infer<typeof TipoListaSoggetti>;
export type TipoErroriAnomalia = z.infer<typeof TipoErroriAnomalia>;
export type RispostaAR001 = z.infer<typeof RispostaAR001>;
export type ProblemError = z.infer<typeof api.schemas.ProblemError>;
export type Problem = z.infer<typeof api.schemas.Problem>;

export type RichiestaAR002 = z.infer<typeof api.schemas.RichiestaAR002>;
export type RispostaAR002OK = z.infer<typeof api.schemas.RispostaAR002OK>;
export type InfoSoggettoItemAR002 = z.infer<
  typeof api.schemas.InfoSoggettoItemAR002
>;
