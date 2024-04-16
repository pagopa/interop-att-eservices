import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const TipoComune = z
  .object({
    nomeComune: z.string(),
    codiceIstat: z.string(),
    siglaProvinciaIstat: z.string(),
    descrizioneLocalita: z.string(),
  })
  .partial()
  .passthrough();
const TipoLocalita = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  })
  .partial()
  .passthrough();
const TipoLuogoNascitaE000 = z
  .object({
    luogoEccezionale: z.string(),
    comune: TipoComune,
    localita: TipoLocalita,
  })
  .partial()
  .passthrough();
const TipoDatiNascitaTemplateE000 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    luogoNascita: TipoLuogoNascitaE000,
  })
  .partial()
  .passthrough();
const TipoCriteriRicercaTemplateAR001 = z
  .object({
    codiceFiscale: z.string(),
    id: z.string(),
    cognome: z.string(),
    nome: z.string(),
    sesso: z.string(),
    datiNascita: TipoDatiNascitaTemplateE000,
  })
  .partial()
  .passthrough();
const TipoToponimo = z
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
const TipoCivicoInterno = z
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
const TipoNumeroCivico = z
  .object({
    codiceCivico: z.string(),
    civicoFonte: z.string(),
    numero: z.string(),
    metrico: z.string(),
    progSNC: z.string(),
    lettera: z.string(),
    esponente1: z.string(),
    colore: z.string(),
    civicoInterno: TipoCivicoInterno,
  })
  .partial()
  .passthrough();
const TipoIndirizzo = z
  .object({
    cap: z.string(),
    comune: TipoComune,
    frazione: z.string(),
    toponimo: TipoToponimo,
    numeroCivico: TipoNumeroCivico,
  })
  .partial()
  .passthrough();
const TipoDatoLocalitaEstera = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  })
  .partial()
  .passthrough();
const TipoToponimoEstero = z
  .object({ denominazione: z.string(), numeroCivico: z.string() })
  .partial()
  .passthrough();
const TipoIndirizzoEstero = z
  .object({
    cap: z.string(),
    localita: TipoDatoLocalitaEstera,
    toponimo: TipoToponimoEstero,
  })
  .partial()
  .passthrough();
const TipoConsolato = z
  .object({ codiceConsolato: z.string(), descrizioneConsolato: z.string() })
  .partial()
  .passthrough();
const TipoLocalitaEstera1 = z
  .object({ indirizzoEstero: TipoIndirizzoEstero, consolato: TipoConsolato })
  .partial()
  .passthrough();
const TipoResidenza = z
  .object({
    tipoIndirizzo: z.string(),
    noteIndirizzo: z.string(),
    indirizzo: TipoIndirizzo,
    localitaEstera: TipoLocalitaEstera1,
    presso: z.string(),
    dataDecorrenzaResidenza: z.string(),
  })
  .partial()
  .passthrough();
const DataPreparationTemplate = z
  .object({
    soggetto: TipoCriteriRicercaTemplateAR001,
    residenza: TipoResidenza,
  })
  .partial();
const DataPreparationResponse = z.object({ uuid: z.string() }).partial();
const DataPreparationTemplateResponse = z
  .object({ uuid: z.string().uuid() })
  .partial()
  .passthrough()
  .and(DataPreparationTemplate);
const TipoDatiNascitaE000 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: TipoLuogoNascitaE000,
  })
  .partial()
  .passthrough();
const TipoParametriRicercaAR001 = z
  .object({
    codiceFiscale: z.string(),
    id: z.string(),
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    datiNascita: TipoDatiNascitaE000,
  })
  .partial()
  .passthrough();
const TipoRichiestaAR001 = z
  .object({
    dataRiferimentoRichiesta: z.string(),
    motivoRichiesta: z.string(),
    casoUso: z.string(),
  })
  .passthrough();
const RichiestaAR001 = z
  .object({
    idOperazioneClient: z.string(),
    parametriRicerca: TipoParametriRicercaAR001,
    richiesta: TipoRichiestaAR001,
  })
  .passthrough();
const TipoCodiceFiscale = z
  .object({
    codFiscale: z.string(),
    validitaCF: z.string(),
    dataAttribuzioneValidita: z.string(),
  })
  .partial()
  .passthrough();
const TipoLuogoEvento = z
  .object({
    luogoEccezionale: z.string(),
    comune: TipoComune,
    localita: TipoLocalita,
  })
  .partial()
  .passthrough();
const TipoIdSchedaSoggettoComune = z
  .object({
    idSchedaSoggettoComuneIstat: z.string(),
    idSchedaSoggetto: z.string(),
  })
  .partial()
  .passthrough();
const TipoGeneralita = z
  .object({
    codiceFiscale: TipoCodiceFiscale,
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    dataNascita: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: TipoLuogoEvento,
    soggettoAIRE: z.string(),
    annoEspatrio: z.string(),
    idSchedaSoggettoComune: TipoIdSchedaSoggettoComune,
    idSchedaSoggetto: z.string(),
    note: z.string(),
  })
  .partial()
  .passthrough();
const TipoIdentificativi = z.object({ id: z.string() }).partial().passthrough();
const TipoAtto = z
  .object({
    comuneRegistrazione: TipoComune,
    ufficioMunicipio: z.string(),
    anno: z.string(),
    parte: z.string(),
    serie: z.string(),
    numeroAtto: z.string(),
    volume: z.string(),
    dataFormazioneAtto: z.string(),
    trascritto: z.string(),
  })
  .partial()
  .passthrough();
const TipoAttoANSC = z
  .object({
    idANSC: z.string(),
    comuneRegistrazione: TipoComune,
    anno: z.string(),
    ufficioMunicipio: z.string(),
    numeroComunale: z.string(),
    dataFormazioneAtto: z.string(),
    trascritto: z.string(),
  })
  .partial()
  .passthrough();
const TipoAttoEvento = z
  .object({ atto: TipoAtto, attoANSC: TipoAttoANSC })
  .partial()
  .passthrough();
const TipoDatiEvento = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoEvento: TipoLuogoEvento,
    attoEvento: TipoAttoEvento,
  })
  .partial()
  .passthrough();
const TipoDatiSoggettiEnte = z
  .object({
    generalita: TipoGeneralita,
    residenza: z.array(TipoResidenza),
    identificativi: TipoIdentificativi,
    datiDecesso: TipoDatiEvento,
  })
  .partial()
  .passthrough();
const TipoListaSoggetti = z
  .object({ soggetto: z.array(TipoDatiSoggettiEnte) })
  .partial()
  .passthrough();
const TipoErroriAnomalia = z
  .object({
    codiceErroreAnomalia: z.string(),
    tipoErroreAnomalia: z.string(),
    testoErroreAnomalia: z.string(),
    oggettoErroreAnomalia: z.string(),
    campoErroreAnomalia: z.string(),
    valoreErroreAnomalia: z.string(),
  })
  .partial()
  .passthrough();
const RispostaAR001 = z
  .object({
    idOperazione: z.string(),
    soggetti: TipoListaSoggetti,
    listaAnomalie: z.array(TipoErroriAnomalia),
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
  TipoDatiSoggettiEnte,
  TipoListaSoggetti,
  TipoErroriAnomalia,
  RispostaAR001,
  ProblemError,
  Problem,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/ar-service-001",
    alias: "AR001",
    description: `Consultazione di un caso d&#x27;uso dell&#x27;ente`,
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
    path: "/ar-service-001/data-preparation",
    alias: "InsertAR001",
    description: `Insert data preparation ar-service-001`,
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
    path: "/ar-service-001/data-preparation",
    alias: "GetAllAR001",
    description: `Lista di tutti i casi d&#x27;uso dell&#x27;ente`,
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
    path: "/ar-service-001/data-preparation",
    alias: "DeleteAR001",
    description: `Eliminazione di un insieme di casi d&#x27;uso dell&#x27;ente`,
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
    path: "/ar-service-001/data-preparation/:uuid",
    alias: "GetByIdAR001",
    description: `Insert data preparation ar-service-001`,
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
    path: "/ar-service-001/data-preparation/:uuid",
    alias: "DeleteByIdAR001",
    description: `Eliminazione di un singolo caso d&#x27;uso dell&#x27;ente`,
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
    path: "/status",
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
