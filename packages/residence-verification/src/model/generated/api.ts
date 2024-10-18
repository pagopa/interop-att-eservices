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
const TipoDatiNascitaTemplateE000 = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    birthPlace: TipoLuogoNascitaE000,
  })
  .partial()
  .passthrough();
const TipoCriteriaTemplateAR001 = z
  .object({
    fiscalCode: z.string(),
    id: z.string(),
    surname: z.string(),
    name: z.string(),
    gender: z.string(),
    birthDate: TipoDatiNascitaTemplateE000,
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
const TipoLocalitaEstera1 = z
  .object({ foreignAddress: TipoIndirizzoEstero, consulate: TipoConsolato })
  .partial()
  .passthrough();
const TipoResidenza = z
  .object({
    addressType: z.string(),
    noteaddress: z.string(),
    address: TipoIndirizzo,
    foreignState: TipoLocalitaEstera1,
    presso: z.string(),
    addressStartDate: z.string(),
  })
  .partial()
  .passthrough();
const DataPreparationTemplate = z
  .object({ subject: TipoCriteriaTemplateAR001, address: TipoResidenza })
  .partial();
const DataPreparationResponse = z.object({ uuid: z.string() }).partial();
const DataPreparationTemplateResponse = z
  .object({ uuid: z.string().uuid() })
  .partial()
  .passthrough()
  .and(DataPreparationTemplate);
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
    fiscalCode: z.string(),
    id: z.string(),
    surname: z.string(),
    noSurname: z.string(),
    name: z.string(),
    noName: z.string(),
    gender: z.string(),
    birthDate: TipoDatiNascitaE000,
  })
  .partial()
  .passthrough();
const TipoRichiestaAR001 = z
  .object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  })
  .passthrough();
const RichiestaAR001 = z
  .object({
    operationId: z.string(),
    criteria: TipoParametriRicercaAR001,
    requestData: TipoRichiestaAR001,
  })
  .passthrough();
const TipoCodiceFiscale = z
  .object({
    fiscalCode: z.string(),
    fiscalCodeValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .partial()
  .passthrough();
const TipoLuogoEvento = z
  .object({
    exceptionalPlace: z.string(),
    municipality: TipoComune,
    place: TipoLocalita,
  })
  .partial()
  .passthrough();
const TipoIdSchedaSoggettoComune = z
  .object({ idCommonSubjectDataIstat: z.string(), idSubjectData: z.string() })
  .partial()
  .passthrough();
const TipoGeneralita = z
  .object({
    fiscalCode: TipoCodiceFiscale,
    surname: z.string(),
    noSurname: z.string(),
    name: z.string(),
    noName: z.string(),
    gender: z.string(),
    birthDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    birthPlace: TipoLuogoEvento,
    AIRESubject: z.string(),
    yearExpatriation: z.string(),
    idCommonSubjectData: TipoIdSchedaSoggettoComune,
    idSubjectData: z.string(),
    note: z.string(),
  })
  .partial()
  .passthrough();
const TipoIdentificativi = z.object({ id: z.string() }).partial().passthrough();
const TipoAtto = z
  .object({
    municipalityRegistration: TipoComune,
    municipalOffice: z.string(),
    year: z.string(),
    part: z.string(),
    series: z.string(),
    actNumber: z.string(),
    volume: z.string(),
    dateFormationAct: z.string(),
    transcribed: z.string(),
  })
  .partial()
  .passthrough();
const TipoAttoANSC = z
  .object({
    idANSC: z.string(),
    municipalityRegistration: TipoComune,
    act: z.string(),
    municipalOffice: z.string(),
    municipalNumber: z.string(),
    dateFormationAct: z.string(),
    transcribed: z.string(),
  })
  .partial()
  .passthrough();
const TipoAttoEvento = z
  .object({ act: TipoAtto, actANSC: TipoAttoANSC })
  .partial()
  .passthrough();
const TipoDatiEvento = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    eventPlace: TipoLuogoEvento,
    eventAct: TipoAttoEvento,
  })
  .partial()
  .passthrough();
const TipoDatiSubjectsEnte = z
  .object({
    generality: TipoGeneralita,
    address: z.array(TipoResidenza),
    identifiers: TipoIdentificativi,
    deathDate: TipoDatiEvento,
  })
  .partial()
  .passthrough();
const TipoListaSubjects = z
  .object({ subject: z.array(TipoDatiSubjectsEnte) })
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
const RispostaAR001 = z
  .object({
    idOp: z.string(),
    subjects: TipoListaSubjects,
    warnings: z.array(TipoErroriAnomalia),
  })
  .partial()
  .passthrough();
const TipocriteriaAR002 = z
  .object({
    fiscalCode: z.string(),
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

export const schemas = {
  TipoComune,
  TipoLocalita,
  TipoLuogoNascitaE000,
  TipoDatiNascitaTemplateE000,
  TipoCriteriaTemplateAR001,
  TipoToponimo,
  TipoCivicoInterno,
  TipoNumeroCivico,
  TipoIndirizzo,
  TipoDatoLocalitaEstera,
  TipoToponimoEstero,
  TipoIndirizzoEstero,
  TipoConsolato,
  TipoLocalitaEstera1,
  TipoResidenza,
  DataPreparationTemplate,
  DataPreparationResponse,
  DataPreparationTemplateResponse,
  TipoDatiNascitaE000,
  TipoParametriRicercaAR001,
  TipoRichiestaAR001,
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
  TipoDatiSubjectsEnte,
  TipoListaSubjects,
  TipoErroriAnomalia,
  RispostaAR001,
  TipocriteriaAR002,
  TipoLocalitaEstera,
  TipoVerificaResidenza,
  TipoVerificaAR002,
  TipoRequestDataAR002,
  RichiestaAR002,
  TipoInfoValore,
  TipoInfoSoggetto,
  InfoSoggettoEnte,
  VerifyTipoDatiSubjects,
  RispostaAR002OK,
  ProblemError,
  Problem,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/residence-verification",
    alias: "AR001",
    description: `Search for a residential address`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RichiestaAR001,
      },
    ],
    response: RispostaAR001,
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
    method: "post",
    path: "/residence-verification/data-preparation",
    alias: "InsertAR001",
    description: `Insert data preparation residence-verification`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DataPreparationTemplate,
      },
    ],
    response: z.object({ uuid: z.string() }).partial(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
    path: "/residence-verification/data-preparation",
    alias: "GetAllAR001",
    description: `List of institution use cases`,
    requestFormat: "json",
    response: z.array(DataPreparationTemplateResponse),
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
    path: "/residence-verification/data-preparation",
    alias: "DeleteAR001",
    description: `Delete institution use cases`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
    path: "/residence-verification/data-preparation/:uuid",
    alias: "GetByIdAR001",
    description: `Insert data preparation residence-verification`,
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DataPreparationTemplate,
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
    path: "/residence-verification/data-preparation/:uuid",
    alias: "DeleteByIdAR001",
    description: `Remove a single use case`,
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
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
