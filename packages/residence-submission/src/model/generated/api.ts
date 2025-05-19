import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const TipoCodiceFiscale = z
  .object({
    subjectId: z.string(),
    subjectIdValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .passthrough();
const TipoLuogoEvento = z.object({}).partial().passthrough();
const TipoIdSchedaSoggettoComune = z.object({}).partial().passthrough();
const TipoGeneralita = z
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
const TipoResidenza = z
  .object({
    addressType: z.string(),
    // noteAddress: z.string(),
  })
  .partial()
  .passthrough();
const TipoIdentificativi = z.object({ id: z.string() }).partial().passthrough();
const TipoDatiEvento = z.object({}).partial().passthrough();
const TipoDatiSubjectsEnte = z
  .object({
    generality: TipoGeneralita,
    address: z.array(TipoResidenza),
    identifiers: TipoIdentificativi,
    deathDate: TipoDatiEvento,
  })
  .passthrough();
const TipoListaSubjects = z
  .object({ subject: TipoDatiSubjectsEnte })
  .passthrough();
const TipoErroriAnomalia = z.object({}).partial().passthrough();
const TipoComune = z
  .object({
    nameMunicipality: z.string(),
    istatCode: z.string(),
    acronymIstatProvince: z.string(),
    placeDescription: z.string(),
  })
  .partial()
  .passthrough();
const TipoLocalita = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    codState: z.string(),
  })
  .partial()
  .passthrough();
const TipoLuogoNascitaE000 = z
  .object({
    exceptionalPlace: z.string(),
    municipality: TipoComune,
    place: TipoLocalita,
  })
  .partial()
  .passthrough();
const TipoDatiNascitaE000 = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    birthPlace: TipoLuogoNascitaE000,
  })
  .partial()
  .passthrough();
const TipoParametriRicercaAR001 = z
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
const RichiestaAR003 = z
  .object({
    idOp: z.string(),
    subjects: TipoListaSubjects,
    warnings: z.array(TipoErroriAnomalia).optional(),
    criteria: TipoParametriRicercaAR001.optional(),
  })
  .passthrough();

export const schemas = {
  TipoCodiceFiscale,
  TipoLuogoEvento,
  TipoIdSchedaSoggettoComune,
  TipoGeneralita,
  TipoResidenza,
  TipoIdentificativi,
  TipoDatiEvento,
  TipoDatiSubjectsEnte,
  TipoListaSubjects,
  TipoErroriAnomalia,
  TipoComune,
  TipoLocalita,
  TipoLuogoNascitaE000,
  TipoDatiNascitaE000,
  TipoParametriRicercaAR001,
  RichiestaAR003,
};

const endpoints = makeApi([
  {
    method: "put",
    path: "/residence-submission",
    alias: "upsertUser",
    description: `Crea o aggiorna un utente in base ai criteri forniti.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RichiestaAR003,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Parametri della richiesta non validi`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/residence-submission/status",
    alias: "healthCheck",
    description: `Verifica lo stato del servizio.`,
    requestFormat: "json",
    response: z.object({
      status: z.string(),
      uptime: z.number(),
      timestamp: z.string(),
    }),
    errors: [
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
