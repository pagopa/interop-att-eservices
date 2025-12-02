import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

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
    provinceCounty: z.string(),
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
const TipocriteriaAR002 = z
  .object({
    subjectId: z.string(),
    id: z.string(),
    surname: z.string(),
    nosurname: z.string(),
    name: z.string(),
    noname: z.string(),
    gender: z.string(),
    birthDate: TipoDatiNascitaE000,
  })
  .partial()
  .passthrough();
const TipoToponimo = z
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
const TipoCivicoInterno = z
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
const TipoNumeroCivico = z
  .object({
    civicCod: z.string(),
    civicSource: z.string(),
    civicNumber: z.string(),
    metric: z.string(),
    progSNC: z.string(),
    letter: z.string(),
    exponent1: z.string(),
    color: z.string(),
    internalCivic: TipoCivicoInterno,
  })
  .partial()
  .passthrough();
const TipoIndirizzo = z
  .object({
    cap: z.string(),
    municipality: TipoComune,
    fraction: z.string(),
    toponym: TipoToponimo,
    civicNumber: TipoNumeroCivico,
  })
  .partial()
  .passthrough();
const TipoDatoLocalitaEstera = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    countryState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();
const TipoToponimoEstero = z
  .object({ denomination: z.string(), civicNumber: z.string() })
  .partial()
  .passthrough();
const TipoIndirizzoEstero = z
  .object({
    cap: z.string(),
    place: TipoDatoLocalitaEstera,
    toponym: TipoToponimoEstero,
  })
  .partial()
  .passthrough();
const TipoConsolato = z
  .object({ consulateCod: z.string(), consulateDescription: z.string() })
  .partial()
  .passthrough();
const TipoLocalitaEstera = z
  .object({ foreignAddress: TipoIndirizzoEstero, consulate: TipoConsolato })
  .partial()
  .passthrough();
const TipoVerificaResidenza = z
  .object({
    addressType: z.string(),
    address: TipoIndirizzo,
    foreignState: TipoLocalitaEstera,
  })
  .partial()
  .passthrough();
const TipoVerificaAR002 = z
  .object({ address: TipoVerificaResidenza })
  .partial()
  .passthrough();
const TipoRequestDataAR002 = z
  .object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  })
  .passthrough();
const RichiestaAR002 = z
  .object({
    operationId: z.string(),
    criteria: TipocriteriaAR002,
    check: TipoVerificaAR002.optional(),
    requestData: TipoRequestDataAR002,
  })
  .passthrough();
const TipoInfoValore = z.enum(["A", "N", "S"]);
const TipoInfoSoggetto = z
  .object({
    id: z.string(),
    key: z.string(),
    value: TipoInfoValore,
    textValue: z.string(),
    dataValue: z.string(),
    otherData: z.string(),
  })
  .partial()
  .passthrough();
const InfoSoggettoEnte = z
  .object({ infoInstitution: z.array(TipoInfoSoggetto) })
  .partial()
  .passthrough();
const VerifyTipoDatiSubjects = z
  .object({ infoSubject: z.array(InfoSoggettoEnte) })
  .partial()
  .passthrough();
const TipoErroriAnomalia = z
  .object({
    warningErrorCode: z.string(),
    warningErrorType: z.string(),
    warningErrorText: z.string(),
    warningErrorObject: z.string(),
    warningErrorField: z.string(),
    warningErrorValue: z.string(),
  })
  .partial()
  .passthrough();
const RispostaAR002OK = z
  .object({
    idOp: z.string(),
    subjects: VerifyTipoDatiSubjects,
    warnings: z.array(TipoErroriAnomalia),
  })
  .partial()
  .passthrough();
const ProblemError = z
  .object({ code: z.string(), detail: z.string() })
  .passthrough();
const Problem = z
  .object({
    type: z.string(),
    status: z.number().int(),
    title: z.string(),
    correlationId: z.string().optional(),
    detail: z.string().optional(),
    errors: z.array(ProblemError).min(1),
  })
  .passthrough();
const PseudonymizationResponse = z
  .object({ seed: z.string(), cryptoHashFunction: z.string() })
  .passthrough();

export const schemas = {
  TipoComune,
  TipoLocalita,
  TipoLuogoNascitaE000,
  TipoDatiNascitaE000,
  TipocriteriaAR002,
  TipoToponimo,
  TipoCivicoInterno,
  TipoNumeroCivico,
  TipoIndirizzo,
  TipoDatoLocalitaEstera,
  TipoToponimoEstero,
  TipoIndirizzoEstero,
  TipoConsolato,
  TipoLocalitaEstera,
  TipoVerificaResidenza,
  TipoVerificaAR002,
  TipoRequestDataAR002,
  RichiestaAR002,
  TipoInfoValore,
  TipoInfoSoggetto,
  InfoSoggettoEnte,
  VerifyTipoDatiSubjects,
  TipoErroriAnomalia,
  RispostaAR002OK,
  ProblemError,
  Problem,
  PseudonymizationResponse,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/residence-verification/check",
    alias: "AR002",
    description: `Check for a residential address`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Request info`,
        type: "Body",
        schema: RichiestaAR002,
      },
    ],
    response: RispostaAR002OK,
    errors: [
      {
        status: 400,
        description: `Not valid request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Address not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/residence-verification/pseudonymization",
    alias: "getPseudonymization",
    description: `Info about crypto hash function and seed`,
    requestFormat: "json",
    response: PseudonymizationResponse,
  },
  {
    method: "get",
    path: "/residence-verification/status",
    alias: "getStatus",
    description: `Return ok`,
    requestFormat: "json",
    response: z
      .object({
        type: z.string(),
        status: z.number().int(),
        title: z.string(),
        correlationId: z.string().optional(),
        detail: z.string().optional(),
        errors: z.array(ProblemError).min(1),
      })
      .passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
