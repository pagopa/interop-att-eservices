import { z } from "zod";

export const TipoCodiceFiscale = z
  .object({
    subjectId: z.string(),
    subjectIdValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .passthrough();

export const TipoLuogoEvento = z.object({}).partial().passthrough();

export const TipoIdSchedaSoggettoComune = z.object({}).partial().passthrough();

export const TipoGeneralita = z
  .object({
    subjectId: TipoCodiceFiscale,
    surname: z.string(),
    noSurname: z.string().optional(),
    name: z.string(),
    noName: z.string().optional(),
    gender: z.string(),
    birthDate: z.string(),
    noDay: z.string().optional(),
    noMonth: z.string().optional(),
    birthPlace: TipoLuogoEvento,
    AIRESubject: z.string(),
    yearExpatriation: z.string(),
    idCommonSubjectData: TipoIdSchedaSoggettoComune,
    idSubjectData: z.string(),
    note: z.string().optional(),
  })
  .passthrough();

export const TipoResidenza = z
  .object({
    addressType: z.string(),
    noteaddress: z.string().optional(),
    address: z.any().optional(),
    foreignState: z.any().optional(),
    presso: z.string().optional(),
    addressStartDate: z.string().optional(),
  })
  .partial()
  .passthrough();

export const TipoIdentificativi = z
  .object({
    id: z.string(),
  })
  .partial()
  .passthrough();

export const TipoDatiEvento = z.object({}).partial().passthrough();

export const TipoDatiSubjectsEnte = z
  .object({
    generality: TipoGeneralita,
    address: z.array(TipoResidenza),
    identifiers: TipoIdentificativi,
    deathDate: TipoDatiEvento,
  })
  .passthrough();

export const TipoListaSubjects = z
  .object({
    subject: TipoDatiSubjectsEnte,
  })
  .passthrough();

export const TipoErroriAnomalia = z.object({}).partial().passthrough();

export const TipoComune = z
  .object({
    nameMunicipality: z.string(),
    istatCode: z.string(),
    acronymIstatProvince: z.string(),
    placeDescription: z.string(),
  })
  .partial()
  .passthrough();

export const TipoLocalita = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    codState: z.string(),
    provinceCounty: z.string().optional(),
  })
  .partial()
  .passthrough();

export const TipoLuogoNascitaE000 = z
  .object({
    exceptionalPlace: z.string(),
    municipality: TipoComune,
    place: TipoLocalita,
  })
  .partial()
  .passthrough();

export const TipoDatiNascitaE000 = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    birthPlace: TipoLuogoNascitaE000,
  })
  .partial()
  .passthrough();

export const TipoParametriRicercaAR001 = z
  .object({
    subjectId: z.string(),
    id: z.string(),
    surname: z.string(),
    name: z.string(),
    gender: z.string(),
    birthDate: TipoDatiNascitaE000,
  })
  .partial()
  .passthrough();

export const RichiestaAR003 = z
  .object({
    idOp: z.string(),
    subjects: TipoListaSubjects,
    warnings: z.array(TipoErroriAnomalia).optional(),
    criteria: TipoParametriRicercaAR001.optional(),
  })
  .passthrough();