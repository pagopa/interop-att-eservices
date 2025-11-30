import { z } from "zod";

const TipoComuneInternal = z
  .object({
    nameMunicipality: z.string(),
    istatCode: z.string(),
    acronymIstatProvince: z.string(),
    placeDescription: z.string(),
  })
  .partial()
  .passthrough();

const TipoLocalitaInternal = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    codState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();

const TipoLuogoNascitaInternal = z
  .object({
    exceptionalPlace: z.string(),
    municipality: TipoComuneInternal,
    place: TipoLocalitaInternal,
  })
  .partial()
  .passthrough();

const TipoDatiNascitaInternal = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    birthPlace: TipoLuogoNascitaInternal,
  })
  .partial()
  .passthrough();

const TipoToponimoInternal = z
  .object({
    codType: z.string(),
    type: z.string(),
    originType: z.string(),
    toponymCod: z.string(),
    toponymDenomination: z.string(),
    toponymSource: z.string(),
  })
  .partial()
  .passthrough();

const TipoCivicoInternoInternal = z
  .object({
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
  })
  .partial()
  .passthrough();

const TipoNumeroCivicoInternal = z
  .object({
    civicCod: z.string(),
    civicSource: z.string(),
    civicNumber: z.string(),
    metric: z.string(),
    progSNC: z.string(),
    letter: z.string(),
    exponent1: z.string(),
    color: z.string(),
    internalCivic: TipoCivicoInternoInternal,
  })
  .partial()
  .passthrough();

const TipoIndirizzoInternal = z
  .object({
    cap: z.string(),
    municipality: TipoComuneInternal,
    fraction: z.string(),
    toponym: TipoToponimoInternal,
    civicNumber: TipoNumeroCivicoInternal,
  })
  .partial()
  .passthrough();

const TipoDatoLocalitaEsteraInternal = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    countryState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();

const TipoToponimoEsteroInternal = z
  .object({
    denomination: z.string(),
    civicNumber: z.string(),
  })
  .partial()
  .passthrough();

const TipoIndirizzoEsteroInternal = z
  .object({
    cap: z.string(),
    place: TipoDatoLocalitaEsteraInternal,
    toponym: TipoToponimoEsteroInternal,
  })
  .partial()
  .passthrough();

const TipoConsolatoInternal = z
  .object({
    consulateCod: z.string(),
    consulateDescription: z.string(),
  })
  .partial()
  .passthrough();

const TipoLocalitaEsteraInternal = z
  .object({
    foreignAddress: TipoIndirizzoEsteroInternal.optional(),
    consulate: TipoConsolatoInternal.optional(),
  })
  .partial()
  .passthrough();

const TipoResidenzaInternal = z
  .object({
    addressType: z.string().optional(),
    address: TipoIndirizzoInternal.optional(),
    foreignState: TipoLocalitaEsteraInternal.optional(),
  })
  .partial()
  .passthrough();

const GeneralitaInternal = z
  .object({
    subjectId: z
      .object({
        subjectId: z.string(),
      })
      .partial()
      .passthrough()
      .optional(),
    id: z.string().optional(),
    surname: z.string().optional(),
    noSurname: z.string().optional(),
    name: z.string().optional(),
    noName: z.string().optional(),
    gender: z.string().optional(),
    birthDate: TipoDatiNascitaInternal.optional(),
  })
  .partial()
  .passthrough();

const SubjectInternal = z
  .object({
    generality: GeneralitaInternal.optional(),
    address: TipoResidenzaInternal.optional(),
  })
  .partial()
  .passthrough();

const SubjectsWrapperInternal = z
  .object({
    subject: SubjectInternal.optional(),
  })
  .partial()
  .passthrough();

export const InternalRequestAR003 = z
  .object({
    operationId: z.string(),
    subjects: SubjectsWrapperInternal.optional(),
  })
  .passthrough();

export type InternalRequestAR003 = z.infer<typeof InternalRequestAR003>;
