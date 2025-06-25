
// TODO: da implementare il sistema di zod drizzle

/**
 * Utilizzare il sistema di Insert schema, come descritto in: 
 * https://orm.drizzle.team/docs/zod#insert-schema
 * 
 * ATTENZIONE:
 * 
 * Capire come gestire le rotte nel file e i vari import all'interno
 * dei file nel domain e nelle routers.
 */

import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

export const TipoComune = z.object({
  nameMunicipality: z.string().optional(),
  istatCode: z.string().optional(),
  acronymIstatProvince: z.string().optional(),
  placeDescription: z.string().optional(),
});
export type TipoComune = z.infer<typeof TipoComune>;

export const TipoLocalita = z.object({
  placeDescription: z.string().optional(),
  countryDescription: z.string().optional(),
  codState: z.string().optional(),
  provinceCounty: z.string().optional(),
});
export type TipoLocalita = z.infer<typeof TipoLocalita>;

export const TipoLuogoNascitaE000 = z.object({
  exceptionalPlace: z.string().optional(),
  municipality: z.lazy(() => TipoComune).optional(),
  place: z.lazy(() => TipoLocalita).optional(),
});
export type TipoLuogoNascitaE000 = z.infer<typeof TipoLuogoNascitaE000>;

export const TipoDatiNascitaTemplateE000 = z.object({
  eventDate: z.string().optional(),
  birthPlace: z.lazy(() => TipoLuogoNascitaE000).optional(),
});
export type TipoDatiNascitaTemplateE000 = z.infer<
  typeof TipoDatiNascitaTemplateE000
>;

export const TipoCriteriRicercaTemplateAR001 = z.object({
  subjectId: z.string().optional(),
  id: z.string().optional(),
  surname: z.string().optional(),
  name: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.lazy(() => TipoDatiNascitaTemplateE000).optional(),
});
export type TipoCriteriRicercaTemplateAR001 = z.infer<
  typeof TipoCriteriRicercaTemplateAR001
>;

export const TipoToponimo = z.object({
  codType: z.string().optional(),
  type: z.string().optional(),
  originType: z.string().optional(),
  toponymCod: z.string().optional(),
  toponymDenomination: z.string().optional(),
  toponymSource: z.string().optional(),
});
export type TipoToponimo = z.infer<typeof TipoToponimo>;

export const TipoCivicoInterno = z.object({
  court: z.string().optional(),
  stairs: z.string().optional(),
  internal1: z.string().optional(),
  espInternal1: z.string().optional(),
  internal2: z.string().optional(),
  espInternal2: z.string().optional(),
  externalStairs: z.string().optional(),
  secondary: z.string().optional(),
  floor: z.string().optional(),
  nui: z.string().optional(),
  isolated: z.string().optional(),
});
export type TipoCivicoInterno = z.infer<typeof TipoCivicoInterno>;

export const TipoNumeroCivico = z.object({
  civicCod: z.string().optional(),
  civicSource: z.string().optional(),
  civicNumber: z.string().optional(),
  metric: z.string().optional(),
  progSNC: z.string().optional(),
  letter: z.string().optional(),
  exponent1: z.string().optional(),
  color: z.string().optional(),
  internalCivic: z.lazy(() => TipoCivicoInterno).optional(),
});
export type TipoNumeroCivico = z.infer<typeof TipoNumeroCivico>;

export const TipoIndirizzo = z.object({
  cap: z.string().optional(),
  municipality: z.lazy(() => TipoComune).optional(),
  fraction: z.string().optional(),
  toponym: z.lazy(() => TipoToponimo).optional(),
  civicNumber: z.lazy(() => TipoNumeroCivico).optional(),
});
export type TipoIndirizzo = z.infer<typeof TipoIndirizzo>;

export const TipoDatoLocalitaEstera = z.object({
  placeDescription: z.string().optional(),
  countryDescription: z.string().optional(),
  countryState: z.string().optional(),
  provinceCounty: z.string().optional(),
});
export type TipoDatoLocalitaEstera = z.infer<typeof TipoDatoLocalitaEstera>;

export const TipoToponimoEstero = z.object({
  denomination: z.string().optional(),
  civicNumber: z.string().optional(),
});
export type TipoToponimoEstero = z.infer<typeof TipoToponimoEstero>;

export const TipoIndirizzoEstero = z.object({
  cap: z.string().optional(),
  place: z.lazy(() => TipoDatoLocalitaEstera).optional(),
  toponym: z.lazy(() => TipoToponimoEstero).optional(),
});
export type TipoIndirizzoEstero = z.infer<typeof TipoIndirizzoEstero>;

export const TipoConsolato = z.object({
  consulateCod: z.string().optional(),
  consulateDescription: z.string().optional(),
});
export type TipoConsolato = z.infer<typeof TipoConsolato>;

export const TipoLocalitaEstera1 = z.object({
  foreignAddress: z.lazy(() => TipoIndirizzoEstero).optional(),
  consulate: z.lazy(() => TipoConsolato).optional(),
});
export type TipoLocalitaEstera1 = z.infer<typeof TipoLocalitaEstera1>;

export const TipoLocalitaEstera = z.object({
  foreignAddress: z.lazy(() => TipoIndirizzoEstero).optional(),
  consulate: z.lazy(() => TipoConsolato).optional(),
});
export type TipoLocalitaEstera = z.infer<typeof TipoLocalitaEstera>;

export const TipoResidenza = z.object({
  addressType: z.string().optional(),
  noteaddress: z.string().optional(),
  address: z.lazy(() => TipoIndirizzo).optional(),
  foreignState: z.lazy(() => TipoLocalitaEstera1).optional(),
  presso: z.string().optional(),
  addressStartDate: z.string().optional(),
});
export type TipoResidenza = z.infer<typeof TipoResidenza>;

export const DataPreparationTemplate = z.object({
  subject: z.lazy(() => TipoCriteriRicercaTemplateAR001).optional(),
  address: z.lazy(() => TipoResidenza).optional(),
});
export type DataPreparationTemplate = z.infer<typeof DataPreparationTemplate>;

export const DataPreparationResponse = z.object({
  uuid: z.string().optional(),
});
export type DataPreparationResponse = z.infer<typeof DataPreparationResponse>;

export const DataPreparationTemplateResponse = z.object({
  uuid: z.string().optional(),
  subject: z.lazy(() => TipoCriteriRicercaTemplateAR001).optional(),
  address: z.lazy(() => TipoResidenza).optional(),
});
export type DataPreparationTemplateResponse = z.infer<
  typeof DataPreparationTemplateResponse
>;

export const TipoDatiNascitaE000 = z.object({
  eventDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  birthPlace: z.lazy(() => TipoLuogoNascitaE000).optional(),
});
export type TipoDatiNascitaE000 = z.infer<typeof TipoDatiNascitaE000>;

export const TipoParametriRicercaAR001 = z.object({
  subjectId: z.string().optional(),
  id: z.string().optional(),
  surname: z.string().optional(),
  name: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.lazy(() => TipoDatiNascitaE000).optional(),
});
export type TipoParametriRicercaAR001 = z.infer<
  typeof TipoParametriRicercaAR001
>;

export const TipoRichiestaAR001 = z.object({
  dateOfRequest: z.string().optional(),
  motivation: z.string().optional(),
  useCase: z.string().optional(),
});
export type TipoRichiestaAR001 = z.infer<typeof TipoRichiestaAR001>;

export const TipoVerificaResidenza = z.object({
  tipoIndirizzo: z.string().optional(),
});
export type TipoVerificaResidenza = z.infer<typeof TipoVerificaResidenza>;

export const RichiestaAR001 = z.object({
  operationId: z.string().optional(),
  criteria: z.lazy(() => TipoParametriRicercaAR001).optional(),
  requestData: z.lazy(() => TipoRichiestaAR001).optional(),
});
export type RichiestaAR001 = z.infer<typeof RichiestaAR001>;

export const TipoCodiceFiscale = z.object({
  subjectId: z.string().optional(),
  subjectIdValidity: z.string().optional(),
  dataAttributionValidity: z.string().optional(),
});
export type TipoCodiceFiscale = z.infer<typeof TipoCodiceFiscale>;

export const TipoLuogoEvento = z.object({
  exceptionalPlace: z.string().optional(),
  municipality: z.lazy(() => TipoComune).optional(),
  place: z.lazy(() => TipoLocalita).optional(),
});
export type TipoLuogoEvento = z.infer<typeof TipoLuogoEvento>;

export const TipoIdSchedaSoggettoComune = z.object({
  idCommonSubjectDataIstat: z.string().optional(),
  idSubjectData: z.string().optional(),
});
export type TipoIdSchedaSoggettoComune = z.infer<
  typeof TipoIdSchedaSoggettoComune
>;

export const TipoGeneralita = z.object({
  subjectId: z.lazy(() => TipoCodiceFiscale).optional(),
  surname: z.string().optional(),
  noSurname: z.string().optional(),
  name: z.string().optional(),
  noName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  birthPlace: z.lazy(() => TipoLuogoEvento).optional(),
  AIRESubject: z.string().optional(),
  yearExpatriation: z.string().optional(),
  idCommonSubjectData: z.lazy(() => TipoIdSchedaSoggettoComune).optional(),
  idSubjectData: z.string().optional(),
  note: z.string().optional(),
});
export type TipoGeneralita = z.infer<typeof TipoGeneralita>;

export const TipoIdentificativi = z.object({
  id: z.string().optional(),
});
export type TipoIdentificativi = z.infer<typeof TipoIdentificativi>;

export const TipoAtto = z.object({
  municipalityRegistration: z.lazy(() => TipoComune).optional(),
  municipalOffice: z.string().optional(),
  year: z.string().optional(),
  part: z.string().optional(),
  series: z.string().optional(),
  actNumber: z.string().optional(),
  volume: z.string().optional(),
  dateFormationAct: z.string().optional(),
  transcribed: z.string().optional(),
});
export type TipoAtto = z.infer<typeof TipoAtto>;

export const TipoAttoANSC = z.object({
  idANSC: z.string().optional(),
  municipalityRegistration: z.lazy(() => TipoComune).optional(),
  act: z.string().optional(),
  municipalOffice: z.string().optional(),
  municipalNumber: z.string().optional(),
  dateFormationAct: z.string().optional(),
  transcribed: z.string().optional(),
});
export type TipoAttoANSC = z.infer<typeof TipoAttoANSC>;

export const TipoAttoEvento = z.object({
  act: z.lazy(() => TipoAtto).optional(),
  actANSC: z.lazy(() => TipoAttoANSC).optional(),
});
export type TipoAttoEvento = z.infer<typeof TipoAttoEvento>;

export const TipoDatiEvento = z.object({
  eventDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  eventPlace: z.lazy(() => TipoLuogoEvento).optional(),
  eventAct: z.lazy(() => TipoAttoEvento).optional(),
});
export type TipoDatiEvento = z.infer<typeof TipoDatiEvento>;

export const TipoDatiSoggettiEnte = z.object({
  generality: z.lazy(() => TipoGeneralita).optional(),
  address: z.array(z.lazy(() => TipoResidenza)).optional(),
  identifiers: z.lazy(() => TipoIdentificativi).optional(),
  deathDate: z.lazy(() => TipoDatiEvento).optional(),
});
export type TipoDatiSoggettiEnte = z.infer<typeof TipoDatiSoggettiEnte>;

export const TipoListaSoggetti = z.object({
  subject: z.array(z.lazy(() => TipoDatiSoggettiEnte)).optional(),
});
export type TipoListaSoggetti = z.infer<typeof TipoListaSoggetti>;

export const InfoSoggettoEnte = z.lazy(() => TipoDatiSoggettiEnte);
export type InfoSoggettoEnte = z.infer<typeof InfoSoggettoEnte>;

export const TipoInfoSoggetto = z.lazy(() => TipoGeneralita);
export type TipoInfoSoggetto = z.infer<typeof TipoInfoSoggetto>;

export const TipoErroriAnomalia = z.object({
  warningErrorCode: z.string().optional(),
  warningErrorType: z.string().optional(),
  warningErrorText: z.string().optional(),
  warningErrorObject: z.string().optional(),
  warningErrorField: z.string().optional(),
  warningErrorValue: z.string().optional(),
});
export type TipoErroriAnomalia = z.infer<typeof TipoErroriAnomalia>;

export const RispostaAR001 = z.object({
  idOperazione: z.string().optional(),
  soggetti: z.lazy(() => TipoDatiSoggettiEnte).optional(),
  listaAnomalie: z.array(z.lazy(() => TipoErroriAnomalia)).optional(),
});
export type RispostaAR001 = z.infer<typeof RispostaAR001>;

export const RichiestaAR002 = z.object({}).passthrough();
export type RichiestaAR002 = z.infer<typeof RichiestaAR002>;

export const RichiestaAR003 = z.object({
  idOp: z.string().optional(),
  subjects: z.lazy(() => TipoListaSoggetti).optional(),
});
export type RichiestaAR003 = z.infer<typeof RichiestaAR003>;

export const RispostaAR002OK = z.object({}).passthrough();
export type RispostaAR002OK = z.infer<typeof RispostaAR002OK>;

export const ProblemError = z.object({
  code: z.string().optional(),
  detail: z.string().optional(),
});
export type ProblemError = z.infer<typeof ProblemError>;

export const Problem = z.object({
  type: z.string().optional(),
  status: z.number().optional(),
  title: z.string().optional(),
  correlationId: z.string().optional(),
  detail: z.string().optional(),
  errors: z.array(z.lazy(() => ProblemError)).optional(),
});
export type Problem = z.infer<typeof Problem>;

export const schemas = {
  TipoComune,
  TipoLocalita,
  TipoLuogoNascitaE000,
  TipoDatiNascitaTemplateE000,
  TipoCriteriRicercaTemplateAR001,
  TipoToponimo,
  TipoCivicoInterno,
  TipoNumeroCivico,
  TipoIndirizzo,
  TipoDatoLocalitaEstera,
  TipoToponimoEstero,
  TipoIndirizzoEstero,
  TipoConsolato,
  TipoLocalitaEstera1,
  TipoLocalitaEstera,
  TipoResidenza,
  DataPreparationTemplate,
  DataPreparationResponse,
  DataPreparationTemplateResponse,
  TipoDatiNascitaE000,
  TipoParametriRicercaAR001,
  TipoRichiestaAR001,
  TipoVerificaResidenza,
  RichiestaAR001,
  TipoCodiceFiscale,
  TipoLuogoEvento,
  TipoIdSchedaSoggettoComune,
  TipoGeneralita,
  TipoIdentificativi,
  TipoAtto,
  TipoAttoANSC,
  TipoAttoEvento,
  TipoDatiEvento,
  TipoDatiSoggettiEnte,
  TipoListaSoggetti,
  InfoSoggettoEnte,
  TipoInfoSoggetto,
  TipoErroriAnomalia,
  RispostaAR001,
  RichiestaAR002,
  RichiestaAR003,
  RispostaAR002OK,
  ProblemError,
  Problem,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/residence-submission",
    alias: "upsertUser",
    description: `Creates a user based on the provided criteria.`,
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
    method: "put",
    path: "/residence-submission",
    alias: "updateUser",
    description: `Updates an existing user based on the provided criteria.`,
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
    method: "delete",
    path: "/residence-submission/:id",
    alias: "deleteUser",
    description: `Deletes a user by id.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid request parameters`,
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
        status: 404,
        description: `User not found`,
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
