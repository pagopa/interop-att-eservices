import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const DbAddress = z
  .object({
    id: z.string(),
    address_type: z.string(),
    note_address: z.string(),
    address_start_date: z.string(),
    presso: z.string(),
    address_municipality_name: z.string(),
    address_municipality_istat_code: z.string(),
    address_municipality_acronym_istat_province: z.string(),
    address_municipality_place_description: z.string(),
    toponym_cod_type: z.string(),
    toponym_type: z.string(),
    toponym_origin_type: z.string(),
    toponym_cod: z.string(),
    toponym_denomination: z.string(),
    toponym_source: z.string(),
    civic_cod: z.string(),
    civic_source: z.string(),
    civic_number: z.string(),
    metric: z.string(),
    prog_snc: z.string(),
    letter: z.string(),
    exponent1: z.string(),
    color: z.string(),
    internal_court: z.string(),
    internal_stairs: z.string(),
    internal1: z.string(),
    esp_internal1: z.string(),
    internal2: z.string(),
    esp_internal2: z.string(),
    external_stairs: z.string(),
    secondary: z.string(),
    floor: z.string(),
    nui: z.string(),
    isolated: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    foreign_cap: z.string(),
    foreign_place_description: z.string(),
    foreign_country_description: z.string(),
    foreign_country_state: z.string(),
    foreign_province_county: z.string(),
    foreign_toponym_denomination: z.string(),
    foreign_toponym_civic_number: z.string(),
    consulate_cod: z.string(),
    consulate_description: z.string(),
  })
  .partial()
  .passthrough();
const DbUsecase = z
  .object({
    id: z.string(),
    purpose_id: z.string(),
    subject_id: z.string(),
    address_id: z.string(),
  })
  .partial()
  .passthrough();
const DbSubject = z
  .object({
    uuid: z.string(),
    id: z.string(),
    subject_id: z.string(),
    surname: z.string(),
    name: z.string(),
    gender: z.string(),
    birth_event_date: z.string(),
    birth_exceptional_place: z.string(),
    birth_municipality_name: z.string(),
    birth_municipality_istat_code: z.string(),
    birth_municipality_acronym_istat_province: z.string(),
    birth_municipality_place_description: z.string(),
    birth_place_description: z.string(),
    birth_country_description: z.string(),
    birth_cod_state: z.string(),
    birth_province_county: z.string(),
  })
  .partial()
  .passthrough();
const DbPurpose = z.object({ id: z.string() }).partial().passthrough();
const MappedDbData = z
  .object({
    purpose: DbPurpose,
    subject: DbSubject,
    addresses: z.array(DbAddress),
    usecases: z.array(DbUsecase),
  })
  .partial()
  .passthrough();
const DebugSchema = z.union([
  DbAddress,
  DbUsecase,
  DbSubject,
  DbPurpose,
  MappedDbData,
]);
const TipoCodiceFiscale = z
  .object({
    subjectId: z.string(),
    subjectIdValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .partial()
  .passthrough();
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
    subjectId: TipoCodiceFiscale,
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
const TipoDatiSoggettiEnte = z
  .object({
    generality: TipoGeneralita,
    address: z.array(TipoResidenza),
    identifiers: TipoIdentificativi,
    deathDate: TipoDatiEvento,
  })
  .partial()
  .passthrough();
const TipoListaSoggetti = z
  .object({ subject: z.array(TipoDatiSoggettiEnte) })
  .partial()
  .passthrough();
const RichiestaAR003 = z
  .object({ idOp: z.string(), subjects: TipoListaSoggetti })
  .partial()
  .passthrough();

export const schemas = {
  DbAddress,
  DbUsecase,
  DbSubject,
  DbPurpose,
  MappedDbData,
  DebugSchema,
  TipoCodiceFiscale,
  TipoComune,
  TipoLocalita,
  TipoLuogoEvento,
  TipoIdSchedaSoggettoComune,
  TipoGeneralita,
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
  TipoIdentificativi,
  TipoAtto,
  TipoAttoANSC,
  TipoAttoEvento,
  TipoDatiEvento,
  TipoDatiSoggettiEnte,
  TipoListaSoggetti,
  RichiestaAR003,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/debug/schema",
    alias: "getDebugSchema",
    requestFormat: "json",
    response: DebugSchema,
  },
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
    method: "delete",
    path: "/residence-submission/:id",
    alias: "deleteUser",
    description: `Deletes a user by their unique identifier.`,
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
    description: `Return ok`,
    requestFormat: "json",
    response: z
      .object({ status: z.string(), uptime: z.number(), timestamp: z.string() })
      .partial()
      .passthrough(),
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
