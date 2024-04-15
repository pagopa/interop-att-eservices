/* import { z } from "zod";

export const TipoComune = z
  .object({
    nomeComune: z.string(),
    codiceIstat: z.string(),
    siglaProvinciaIstat: z.string(),
    descrizioneLocalita: z.string(),
  });
  export type TipoComune = z.infer<typeof TipoComune>;

  export const TipoLocalita = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  });
  export type TipoLocalita = z.infer<typeof TipoLocalita>;

  export const TipoLuogoNascitaE000 = z
  .object({
    luogoEccezionale: z.string(),
    comune: TipoComune,
    localita: TipoLocalita,
  });
  export type TipoLuogoNascitaE000 = z.infer<typeof TipoLuogoNascitaE000>;

  export const TipoDatiNascitaTemplateE000 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    luogoNascita: TipoLuogoNascitaE000,
  });
  export type TipoDatiNascitaTemplateE000 = z.infer<typeof TipoDatiNascitaTemplateE000>;

  export const TipoCriteriRicercaTemplateAR001 = z
  .object({
    codiceFiscale: z.string(),
    id: z.string(),
    cognome: z.string(),
    nome: z.string(),
    sesso: z.string(),
    datiNascita: TipoDatiNascitaTemplateE000,
  });
  export type TipoCriteriRicercaTemplateAR001 = z.infer<typeof TipoCriteriRicercaTemplateAR001>;

  export const TipoToponimo = z
  .object({
    codSpecie: z.string(),
    specie: z.string(),
    specieFonte: z.string(),
    codToponimo: z.string(),
    denominazioneToponimo: z.string(),
    toponimoFonte: z.string(),
  });
  export type TipoToponimo = z.infer<typeof TipoToponimo>;

  export const TipoCivicoInterno = z
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
  });
  export type TipoCivicoInterno = z.infer<typeof TipoCivicoInterno>;

  export const TipoNumeroCivico = z
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
  });
  export type TipoNumeroCivico = z.infer<typeof TipoNumeroCivico>;

  export const TipoIndirizzo = z
  .object({
    cap: z.string(),
    comune: TipoComune,
    frazione: z.string(),
    toponimo: TipoToponimo,
    numeroCivico: TipoNumeroCivico,
  });
  export type TipoIndirizzo = z.infer<typeof TipoIndirizzo>;

  export const TipoDatoLocalitaEstera = z
  .object({
    descrizioneLocalita: z.string(),
    descrizioneStato: z.string(),
    codiceStato: z.string(),
    provinciaContea: z.string(),
  });
  export type TipoDatoLocalitaEstera = z.infer<typeof TipoDatoLocalitaEstera>;

  export const TipoToponimoEstero = z
  .object({ denominazione: z.string(), numeroCivico: z.string() });
  export type TipoToponimoEstero = z.infer<typeof TipoToponimoEstero>;

  export const TipoIndirizzoEstero = z
  .object({
    cap: z.string(),
    localita: TipoDatoLocalitaEstera,
    toponimo: TipoToponimoEstero,
  });
  export type TipoIndirizzoEstero = z.infer<typeof TipoIndirizzoEstero>;

  export const TipoConsolato = z
  .object({ codiceConsolato: z.string(), descrizioneConsolato: z.string() });
  export type TipoConsolato = z.infer<typeof TipoConsolato>;

  export const TipoLocalitaEstera1 = z
  .object({ indirizzoEstero: TipoIndirizzoEstero, consolato: TipoConsolato });
  export type TipoLocalitaEstera1 = z.infer<typeof TipoLocalitaEstera1>;

  export const TipoResidenza = z
  .object({
    tipoIndirizzo: z.string(),
    noteIndirizzo: z.string(),
    indirizzo: TipoIndirizzo,
    localitaEstera: TipoLocalitaEstera1,
    presso: z.string(),
    dataDecorrenzaResidenza: z.string(),
  });
  export type TipoResidenza = z.infer<typeof TipoResidenza>;

  export const DataPreparationTemplate = z
  .object({
    datiSoggetto: TipoCriteriRicercaTemplateAR001,
    residenza: TipoResidenza,
  });
  export type DataPreparationTemplate = z.infer<typeof DataPreparationTemplate>;

  export const DataPreparationResponse = z.object({ uuid: z.string() });
  export type DataPreparationResponse = z.infer<typeof DataPreparationResponse>;

  export const DataPreparationTemplateResponse = z
  .object({ uuid: z.string().uuid() })
  .partial()
  .passthrough()
  .and(DataPreparationTemplate);
  export type DataPreparationTemplateResponse = z.infer<typeof DataPreparationTemplateResponse>;

  export const TipoDatiNascitaE000 = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: TipoLuogoNascitaE000,
  });
  export type TipoDatiNascitaE000 = z.infer<typeof TipoDatiNascitaE000>;

  export const TipoParametriRicercaAR001 = z
  .object({
    codiceFiscale: z.string(),
    id: z.string(),
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    datiNascita: TipoDatiNascitaE000,
  });
  export type TipoParametriRicercaAR001 = z.infer<typeof TipoParametriRicercaAR001>;

  export const TipoRichiestaAR001 = z
  .object({
    dataRiferimentoRichiesta: z.string(),
    motivoRichiesta: z.string(),
    casoUso: z.string(),
  });
  export type TipoRichiestaAR001 = z.infer<typeof TipoRichiestaAR001>;

  export const RichiestaAR001 = z
  .object({
    idOperazioneClient: z.string(),
    parametriRicerca: TipoParametriRicercaAR001,
    richiesta: TipoRichiestaAR001,
  });
  export type RichiestaAR001 = z.infer<typeof RichiestaAR001>;

  export const TipoCodiceFiscale = z
  .object({
    codFiscale: z.string(),
    validitaCF: z.string(),
    dataAttribuzioneValidita: z.string(),
  });
  export type TipoCodiceFiscale = z.infer<typeof TipoCodiceFiscale>;

  export const TipoLuogoEvento = z
  .object({
    luogoEccezionale: z.string(),
    comune: TipoComune,
    localita: TipoLocalita,
  });
  export type TipoLuogoEvento = z.infer<typeof TipoLuogoEvento>;

  export const TipoIdSchedaSoggettoComune = z
  .object({
    idSchedaSoggettoComuneIstat: z.string(),
    idSchedaSoggetto: z.string(),
  });
  export type TipoIdSchedaSoggettoComune = z.infer<typeof TipoIdSchedaSoggettoComune>;

  export const TipoGeneralita = z
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
  });
  export type TipoGeneralita = z.infer<typeof TipoGeneralita>;

  export const TipoIdentificativi = z
  .object({ id: z.string() });
  export type TipoIdentificativi = z.infer<typeof TipoIdentificativi>;

  export const TipoAtto = z
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
  });
  export type TipoAtto = z.infer<typeof TipoAtto>;

  export const TipoAttoANSC = z
  .object({
    idANSC: z.string(),
    comuneRegistrazione: TipoComune,
    anno: z.string(),
    ufficioMunicipio: z.string(),
    numeroComunale: z.string(),
    dataFormazioneAtto: z.string(),
    trascritto: z.string(),
  });
  export type TipoAttoANSC = z.infer<typeof TipoAttoANSC>;

  export const TipoAttoEvento = z
  .object({ atto: TipoAtto, attoANSC: TipoAttoANSC });
  export type TipoAttoEvento = z.infer<typeof TipoAttoEvento>;

  export const TipoDatiEvento = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoEvento: TipoLuogoEvento,
    attoEvento: TipoAttoEvento,
  });
  export type TipoDatiEvento = z.infer<typeof TipoDatiEvento>;

  export const TipoDatiSoggettiEnte = z
  .object({
    generalita: TipoGeneralita,
    residenza: z.array(TipoResidenza),
    identificativi: TipoIdentificativi,
    datiDecesso: TipoDatiEvento,
  });
  export type TipoDatiSoggettiEnte = z.infer<typeof TipoDatiSoggettiEnte>;

  export const TipoListaSoggetti = z
  .object({ soggetto: z.array(TipoDatiSoggettiEnte) });
  export type TipoListaSoggetti = z.infer<typeof TipoListaSoggetti>;

  export const TipoErroriAnomalia = z
  .object({
    codiceErroreAnomalia: z.string(),
    tipoErroreAnomalia: z.string(),
    testoErroreAnomalia: z.string(),
    oggettoErroreAnomalia: z.string(),
    campoErroreAnomalia: z.string(),
    valoreErroreAnomalia: z.string(),
  });
  export type TipoErroriAnomalia = z.infer<typeof TipoErroriAnomalia>;

  export const RispostaAR001 = z
  .object({
    idOperazione: z.string(),
    listaSoggetti: TipoListaSoggetti,
    listaAnomalie: z.array(TipoErroriAnomalia),
  });
  export type RispostaAR001 = z.infer<typeof RispostaAR001>;
 
  export const ProblemError = z
  .object({ code: z.string(), detail: z.string() });
  export type ProblemError = z.infer<typeof ProblemError>;

  export const Problem = z
  .object({
    type: z.string(),
    status: z.number().int(),
    title: z.string(),
    correlationId: z.string().optional(),
    detail: z.string().optional(),
    errors: z.array(ProblemError).min(1),
  });
  export type Problem = z.infer<typeof Problem>;

 */
