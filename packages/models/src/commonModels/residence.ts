
// Here will be shared models for residence-related data structures.

import * as z from 'zod';


export const TipoToponimoModel = z.object({
  codType: z.string(),
  type: z.string(),
  originType: z.string(),
  toponymCod: z.string(),
  toponymDenomination: z.string(),
  toponymSource: z.string(),
});
export type TipoToponimoModel = z.infer<typeof TipoToponimoModel>;

export const TipoComuneModel = z.object({
  nameMunicipality: z.string(),
  istatCode: z.string(),
  acronymIstatProvince: z.string(),
  placeDescription: z.string(),
});
export type TipoComuneModel = z.infer<typeof TipoComuneModel>;

export const TipoCivicoInternoModel = z.object({
  court: z.string(),
  stairs: z.string(),
  internal1: z.string(),
  espInternal1: z.string(),
  internal2: z.string(),
  espInternal2: z.string(),
  externalStairs: z.string(),
  secondary: z.string(),
  floor: z.string(),
  nui: z.string(),
  isolated: z.string(),
});
export type TipoCivicoInternoModel = z.infer<typeof TipoCivicoInternoModel>;

export const TipoNumeroCivicoModel = z.object({
  civicCod: z.string(),
  civicSource: z.string(),
  civicNumber: z.string(),
  metric: z.string(),
  progSNC: z.string(),
  letter: z.string(),
  exponent1: z.string(),
  color: z.string(),
  internalCivic: TipoCivicoInternoModel,
});
export type TipoNumeroCivicoModel = z.infer<typeof TipoNumeroCivicoModel>;

export const TipoIndirizzoModel = z.object({
  cap: z.string(),
  municipality: TipoComuneModel,
  fraction: z.string(),
  toponym: TipoToponimoModel,
  civicNumber: TipoNumeroCivicoModel,
});
export type TipoIndirizzoModel = z.infer<typeof TipoIndirizzoModel>;

export const TipoLocalitaModel = z.object({
  placeDescription: z.string(),
  countryDescription: z.string(),
  codState: z.string(),
  provinceCounty: z.string(),
});
export type TipoLocalitaModel = z.infer<typeof TipoLocalitaModel>;
export const TipoDatoLocalitaEsteraModel = z.object({
  placeDescription: z.string(),
  countryDescription: z.string(),
  countryState: z.string(),
  provinceCounty: z.string(),
});
export type TipoDatoLocalitaEsteraModel = z.infer<
  typeof TipoDatoLocalitaEsteraModel
>;

export const TipoToponimoEsteroModel = z.object({
  denomination: z.string(),
  civicNumber: z.string(),
});
export type TipoToponimoEsteroModel = z.infer<typeof TipoToponimoEsteroModel>;

export const TipoIndirizzoEsteroModel = z.object({
  cap: z.string(),
  place: TipoDatoLocalitaEsteraModel,
  toponym: TipoToponimoEsteroModel,
});
export type TipoIndirizzoEsteroModel = z.infer<typeof TipoIndirizzoEsteroModel>;

export const TipoConsolatoModel = z.object({
  consulateCod: z.string(),
  consulateDescription: z.string(),
});
export type TipoConsolatoModel = z.infer<typeof TipoConsolatoModel>;


export const TipoLocalitaEsteraModel = z.object({
  foreignAddress: TipoIndirizzoEsteroModel,
  consulate: TipoConsolatoModel,
});
export type TipoLocalitaEsteraModel = z.infer<typeof TipoLocalitaEsteraModel>;

export const TipoResidenzaModel = z.object({
  addressType: z.string(),
  noteaddress: z.string(),
  address: TipoIndirizzoModel,
  foreignState: TipoLocalitaEsteraModel,
  presso: z.string(),
  addressStartDate: z.string(),
});
export type TipoResidenzaModel = z.infer<typeof TipoResidenzaModel>;

export const TipoLuogoNascitaModel = z.object({
  exceptionalPlace: z.string(),
  municipality: TipoComuneModel,
  place: TipoLocalitaModel,
});
export type TipoLuogoNascitaModel = z.infer<typeof TipoLuogoNascitaModel>;

export const TipoDataNascitaModel = z.object({
  eventDate: z.string(),
  birthPlace: TipoLuogoNascitaModel,
});
export type TipoDataNascitaModel = z.infer<typeof TipoDataNascitaModel>;

export const SoggettoModel = z.object({
  subjectId: z.string(),
  id: z.string(),
  surname: z.string(),
  name: z.string(),
  gender: z.string(),
  birthDate: TipoDataNascitaModel,
});
export type SoggettoModel = z.infer<typeof SoggettoModel>;

export const Soggetto = z.object({
  subjectId: z.string(),
  id: z.string(),
  surname: z.string(),
  name: z.string(),
  gender: z.string(),
  birthDate: TipoDataNascitaModel,
});
export type Soggetto = z.infer<typeof Soggetto>;

export const ProblemErrorModel = z
  .object({
    code: z.string(),
    detail: z.string(),
  })
  .partial()
  .passthrough();
export type ProblemErrorModel = z.infer<typeof ProblemErrorModel>;

export const ProblemModel = z.object({
  type: z.string(),
  status: z.number().int(),
  title: z.string(),
  correlationId: z.string().optional(),
  detail: z.string().optional(),
  errors: z.array(ProblemErrorModel).min(1),
});
export type ProblemModel = z.infer<typeof ProblemModel>;