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
const TipoParametriRicercaAR001 = z
  .object({
    subjectId: z.string(),
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
    subjectId: z.string(),
    subjectIdValidity: z.string(),
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
const TipoComuneAR002 = z
  .object({
    nomeComune: z.string(),
    codiceIstat: z.string(),
    siglaProvinciaIstat: z.string(),
    descrizioneLocalita: z.string(),
  })
  .partial()
  .passthrough();
const TipoLocalitaAR002 = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  })
  .partial()
  .passthrough();
const DatiNascitaAR002 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: z
      .object({
        luogoEccezionale: z.string(),
        comune: TipoComuneAR002,
        localita: TipoLocalitaAR002,
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const CriteriRicercaAR002 = z
  .object({
    codiceFiscale: z.string(),
    idANPR: z.string(),
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    datiNascita: DatiNascitaAR002,
  })
  .partial()
  .passthrough();
const TipoToponimoAR002 = z
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
const TipoCivicoInternoAR002 = z
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
const TipoNumeroCivicoAR002 = z
  .object({
    codiceCivico: z.string(),
    civicoFonte: z.string(),
    numero: z.string(),
    metrico: z.string(),
    progSNC: z.string(),
    lettera: z.string(),
    esponente1: z.string(),
    colore: z.string(),
    civicoInterno: TipoCivicoInternoAR002,
  })
  .partial()
  .passthrough();
const TipoIndirizzoAR002 = z
  .object({
    cap: z.string(),
    comune: TipoComuneAR002,
    frazione: z.string(),
    toponimo: TipoToponimoAR002,
    numeroCivico: TipoNumeroCivicoAR002,
  })
  .partial()
  .passthrough();
const TipoLocalitaEsteraAR002 = z
  .object({
    indirizzoEstero: z
      .object({
        cap: z.string(),
        localita: TipoLocalitaAR002,
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
const VerificaAR002 = z
  .object({
    residenza: z
      .object({
        tipoIndirizzo: z.string(),
        indirizzo: TipoIndirizzoAR002,
        localitaEstera: TipoLocalitaEsteraAR002,
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const DatiRichiestaAR002 = z
  .object({
    dataRiferimentoRichiesta: z.string(),
    motivoRichiesta: z.string(),
    casoUso: z.string(),
  })
  .passthrough();
const RichiestaAR002 = z
  .object({
    idOperazioneClient: z.string(),
    criteriRicerca: CriteriRicercaAR002,
    verifica: VerificaAR002.optional(),
    datiRichiesta: DatiRichiestaAR002,
  })
  .passthrough();
const InfoSoggettoItemAR002 = z
  .object({
    id: z.string(),
    chiave: z.string(),
    valore: z.enum(["A", "N", "S", "D"]),
    valoreTesto: z.string(),
    valoreData: z.string(),
    dettaglio: z.string(),
  })
  .partial()
  .passthrough();
const DatiSoggettoEnteAR002 = z
  .object({ infoSoggettoEnte: z.array(InfoSoggettoItemAR002) })
  .partial()
  .passthrough();
const AnomaliaAR002 = z
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
const RispostaAR002OK = z
  .object({
    idOperazioneANPR: z.string(),
    listaSoggetti: z
      .object({ datiSoggetto: z.array(DatiSoggettoEnteAR002) })
      .partial()
      .passthrough(),
    listaAnomalie: z.array(AnomaliaAR002),
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
  TipoParametriRicercaAR001,
  TipoRichiestaAR001,
  RichiestaAR001,
  TipoCodiceFiscale,
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
  TipoDatiSubjectsEnte,
  TipoListaSubjects,
  TipoErroriAnomalia,
  RispostaAR001,
  TipoComuneAR002,
  TipoLocalitaAR002,
  DatiNascitaAR002,
  CriteriRicercaAR002,
  TipoToponimoAR002,
  TipoCivicoInternoAR002,
  TipoNumeroCivicoAR002,
  TipoIndirizzoAR002,
  TipoLocalitaEsteraAR002,
  VerificaAR002,
  DatiRichiestaAR002,
  RichiestaAR002,
  InfoSoggettoItemAR002,
  DatiSoggettoEnteAR002,
  AnomaliaAR002,
  RispostaAR002OK,
  ProblemError,
  Problem,
  PseudonymizationResponse,
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
