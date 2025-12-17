import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ComuneAR003 = z
  .object({
    nomeComune: z.string(),
    codiceIstat: z.string(),
    siglaProvinciaIstat: z.string(),
    descrizioneLocalita: z.string(),
  })
  .partial()
  .passthrough();
const LocalitaAR003 = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  })
  .partial()
  .passthrough();
const DatiNascitaAR003 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: z
      .object({
        luogoEccezionale: z.string(),
        comune: ComuneAR003,
        localita: LocalitaAR003,
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const ToponimoAR003 = z
  .object({
    codSpecie: z.string(),
    specie: z.string(),
    specieFonte: z.string(),
    codToponimo: z.string(),
    denominazioneToponimo: z.string(),
    toponimoFonte: z.string(),
  })
  .partial()
  .passthrough();
const CivicoInternoAR003 = z
  .object({
    corte: z.string(),
    scala: z.string(),
    interno1: z.string(),
    espInterno1: z.string(),
    interno2: z.string(),
    espInterno2: z.string(),
    scalaEsterna: z.string(),
    secondario: z.string(),
    piano: z.string(),
    nui: z.string(),
    isolato: z.string(),
  })
  .partial()
  .passthrough();
const NumeroCivicoAR003 = z
  .object({
    codiceCivico: z.string(),
    civicoFonte: z.string(),
    numero: z.string(),
    metrico: z.string(),
    progSNC: z.string(),
    lettera: z.string(),
    esponente1: z.string(),
    colore: z.string(),
    civicoInterno: CivicoInternoAR003,
  })
  .partial()
  .passthrough();
const IndirizzoCompletoAR003 = z
  .object({
    cap: z.string(),
    comune: ComuneAR003,
    frazione: z.string(),
    toponimo: ToponimoAR003,
    numeroCivico: NumeroCivicoAR003,
  })
  .partial()
  .passthrough();
const LocalitaEsteraAR003 = z
  .object({
    indirizzoEstero: z
      .object({
        cap: z.string(),
        localita: LocalitaAR003,
        toponimo: z
          .object({ denominazione: z.string(), numeroCivico: z.string() })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
    consolato: z
      .object({ codiceConsolato: z.string(), descrizioneConsolato: z.string() })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const ResidenzaAR003 = z
  .object({
    tipoIndirizzo: z.string(),
    indirizzo: IndirizzoCompletoAR003,
    localitaEstera: LocalitaEsteraAR003,
  })
  .partial()
  .passthrough();
const SoggettoAR003 = z
  .object({
    codiceFiscale: z.string(),
    idANPR: z.string().optional(),
    cognome: z.string().optional(),
    senzaCognome: z.string().optional(),
    nome: z.string().optional(),
    senzaNome: z.string().optional(),
    sesso: z.string().optional(),
    datiNascita: DatiNascitaAR003.optional(),
    residenza: ResidenzaAR003.optional(),
  })
  .passthrough();
const RichiestaAR003 = z
  .object({ idOperazioneClient: z.string(), soggetto: SoggettoAR003 })
  .passthrough();

export const schemas = {
  ComuneAR003,
  LocalitaAR003,
  DatiNascitaAR003,
  ToponimoAR003,
  CivicoInternoAR003,
  NumeroCivicoAR003,
  IndirizzoCompletoAR003,
  LocalitaEsteraAR003,
  ResidenzaAR003,
  SoggettoAR003,
  RichiestaAR003,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/residence-submission",
    alias: "upsertUser",
    description: `Crea un utente in base ai criteri forniti.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RichiestaAR003,
      },
    ],
    response: z
      .object({ status: z.string(), message: z.string() })
      .partial()
      .passthrough(),
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
    description: `Aggiorna un utente esistente in base ai criteri forniti.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RichiestaAR003,
      },
    ],
    response: z
      .object({ status: z.string(), message: z.string() })
      .partial()
      .passthrough(),
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
    description: `Elimina un utente tramite il suo identificativo univoco.`,
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
    description: `Restituisce ok`,
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
