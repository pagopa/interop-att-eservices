import { z } from "zod";
import * as api from "../generated/api.js";

export type TipoCodiceFiscale = z.infer<typeof api.schemas.TipoCodiceFiscale>;
export type TipoComune = z.infer<typeof api.schemas.TipoComune>;
export type TipoLocalita = z.infer<typeof api.schemas.TipoLocalita>;
export type TipoLuogoEvento = z.infer<typeof api.schemas.TipoLuogoEvento>;
export type TipoIdSchedaSoggettoComune = z.infer<
  typeof api.schemas.TipoIdSchedaSoggettoComune
>;
export type TipoGeneralita = z.infer<typeof api.schemas.TipoGeneralita>;
export type TipoToponimo = z.infer<typeof api.schemas.TipoToponimo>;
export type TipoCivicoInterno = z.infer<typeof api.schemas.TipoCivicoInterno>;
export type TipoNumeroCivico = z.infer<typeof api.schemas.TipoNumeroCivico>;
export type TipoIndirizzo = z.infer<typeof api.schemas.TipoIndirizzo>;
export type TipoDatoLocalitaEstera = z.infer<
  typeof api.schemas.TipoDatoLocalitaEstera
>;
export type TipoToponimoEstero = z.infer<typeof api.schemas.TipoToponimoEstero>;
export type TipoIndirizzoEstero = z.infer<
  typeof api.schemas.TipoIndirizzoEstero
>;
export type TipoConsolato = z.infer<typeof api.schemas.TipoConsolato>;
export type TipoLocalitaEstera1 = z.infer<
  typeof api.schemas.TipoLocalitaEstera1
>;
export type TipoResidenza = z.infer<typeof api.schemas.TipoResidenza>;
export type TipoIdentificativi = z.infer<typeof api.schemas.TipoIdentificativi>;
export type TipoAtto = z.infer<typeof api.schemas.TipoAtto>;
export type TipoAttoANSC = z.infer<typeof api.schemas.TipoAttoANSC>;
export type TipoAttoEvento = z.infer<typeof api.schemas.TipoAttoEvento>;
export type TipoDatiEvento = z.infer<typeof api.schemas.TipoDatiEvento>;
export type TipoDatiSoggettiEnte = z.infer<
  typeof api.schemas.TipoDatiSoggettiEnte
>;
export type TipoListaSoggetti = z.infer<typeof api.schemas.TipoListaSoggetti>;
export type RichiestaAR003 = z.infer<typeof api.schemas.RichiestaAR003>;
export type DbAddress = z.infer<typeof api.schemas.DbAddress>;
export type DbPurpose = z.infer<typeof api.schemas.DbPurpose>;
export type DbSubject = z.infer<typeof api.schemas.DbSubject>;
export type DbUsecase = z.infer<typeof api.schemas.DbUsecase>;
export type MappedDbData = z.infer<typeof api.schemas.MappedDbData>;
