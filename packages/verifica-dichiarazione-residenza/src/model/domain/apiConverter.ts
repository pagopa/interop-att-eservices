import {
  SoggettoModel,
  UserModel,
  TipoLuogoNascitaModel,
  TipoLocalitaModel,
  TipoComuneModel,
  TipoDataNascitaModel,
  TipoToponimoModel,
  TipoCivicoInternoModel,
  TipoNumeroCivicoModel,
  TipoIndirizzoModel,
  TipoDatoLocalitaEsteraModel,
  TipoToponimoEsteroModel,
  TipoIndirizzoEsteroModel,
  TipoConsolatoModel,
  TipoLocalitaEsteraModel,
  TipoResidenzaModel,
  // UserModelFullResponse
  // DataPreparationResponseModel,
  
  TipoDatiNascitaModel,
  TipoParametriRicercaModel,
  TipoRichiestaModel,
  RichiestaModel,
  TipoCodiceFiscaleModel,
  TipoLuogoEventoModel,
  TipoIdSchedaSoggettoComuneModel,
 
  TipoGeneralitaModel,
  TipoIdentificativiModel,
  TipoAttoModel,
  TipoAttoANSCModel,
  TipoAttoEventoModel,
  TipoDatiEventoModel,
  TipoDatiSoggettiEnteModel,
  TipoListaSoggettiModel,
  TipoErroriAnomaliaModel,
  RispostaAR001Model,
  ProblemErrorModel,
  ProblemModel,
} from "pdnd-model";
import { getUserModelByCodiceFiscale } from "../../utilities/userUtilities.js";
import {
  generateRandomUUID,
  isValidUUID,
} from "../../utilities/uuidUtilities.js";

import {
  DataPreparationTemplate,
  TipoLocalita,
  TipoComune,
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
} from "./models.js";

export const apiTipoComuneToTipoComuneModel = (
  tipoComune: TipoComune | undefined
): TipoComuneModel => ({
  nomeComune: tipoComune?.nomeComune || "",
  codiceIstat: tipoComune?.codiceIstat || "",
  siglaProvinciaIstat: tipoComune?.siglaProvinciaIstat || "",
  descrizioneLocalita: tipoComune?.descrizioneLocalita || "",
});

export const apiTipoLocalitaToTipoLocalita = (
  tipoLocalita: TipoLocalita | undefined
): TipoLocalitaModel => ({
  descrizioneLocalita: tipoLocalita?.descrizioneLocalita || "",
  descrizioneStato: tipoLocalita?.descrizioneStato || "",
  codiceStato: tipoLocalita?.codiceStato || "",
  provinciaContea: tipoLocalita?.provinciaContea || "",
});

export const apiTipoLuogoNascitaToTipoLuogoNascitaModel = (
  tipoLuogoNascitaE000: TipoLuogoNascitaE000 | undefined
): TipoLuogoNascitaModel => ({
  luogoEccezionale: tipoLuogoNascitaE000?.luogoEccezionale || "",
  comune: apiTipoComuneToTipoComuneModel(tipoLuogoNascitaE000?.comune),
  localita: apiTipoLocalitaToTipoLocalita(tipoLuogoNascitaE000?.localita),
});

export const apiTipoDatiNascitaTemplateE000ToTipoDataNascitaModel = (
  tipoDatiNascitaTemplateE000: TipoDatiNascitaTemplateE000 | undefined
): TipoDataNascitaModel => ({
  dataEvento: tipoDatiNascitaTemplateE000?.dataEvento || "",
  luogoNascita: apiTipoLuogoNascitaToTipoLuogoNascitaModel(
    tipoDatiNascitaTemplateE000?.luogoNascita
  ),
});

export const apiTipoCriteriRicercaTemplateAR001ToSoggettoModel = (
  tipoCriteriRicercaTemplateAR001: TipoCriteriRicercaTemplateAR001 | undefined
): SoggettoModel => ({
  codiceFiscale: tipoCriteriRicercaTemplateAR001?.codiceFiscale || "",
  id: tipoCriteriRicercaTemplateAR001?.id || "",
  cognome: tipoCriteriRicercaTemplateAR001?.cognome || "",
  nome: tipoCriteriRicercaTemplateAR001?.nome || "",
  sesso: tipoCriteriRicercaTemplateAR001?.sesso || "",
  datiNascita: apiTipoDatiNascitaTemplateE000ToTipoDataNascitaModel(
    tipoCriteriRicercaTemplateAR001?.datiNascita
  ),
});

export const apiTipoToponimoToTipoToponimoModel = (
  tipoToponimo: TipoToponimo | undefined
): TipoToponimoModel => ({
  codSpecie: tipoToponimo?.codSpecie || "",
  specie: tipoToponimo?.specie || "",
  specieFonte: tipoToponimo?.specieFonte || "",
  codToponimo: tipoToponimo?.codSpecie || "",
  denominazioneToponimo: tipoToponimo?.denominazioneToponimo || "",
  toponimoFonte: tipoToponimo?.toponimoFonte || "",
});

export const apiTipoCivicoInternoToTipoCivicoInternoModel = (
  tipoCivicoInterno: TipoCivicoInterno | undefined
): TipoCivicoInternoModel => ({
  corte: tipoCivicoInterno?.corte || "",
  scala: tipoCivicoInterno?.scala || "",
  interno1: tipoCivicoInterno?.interno1 || "",
  espInterno1: tipoCivicoInterno?.espInterno1 || "",
  interno2: tipoCivicoInterno?.interno2 || "",
  espInterno2: tipoCivicoInterno?.espInterno2 || "",
  scalaEsterna: tipoCivicoInterno?.scalaEsterna || "",
  secondario: tipoCivicoInterno?.secondario || "",
  piano: tipoCivicoInterno?.piano || "",
  nui: tipoCivicoInterno?.nui || "",
  isolato: tipoCivicoInterno?.isolato || "",
});

export const apiTipoNumeroCivicoToTipoNumeroCivicoModel = (
  tipoNumeroCivicoModel: TipoNumeroCivico | undefined
): TipoNumeroCivicoModel => ({
  codiceCivico: tipoNumeroCivicoModel?.codiceCivico || "",
  civicoFonte: tipoNumeroCivicoModel?.civicoFonte || "",
  numero: tipoNumeroCivicoModel?.numero || "",
  metrico: tipoNumeroCivicoModel?.metrico || "",
  progSNC: tipoNumeroCivicoModel?.progSNC || "",
  lettera: tipoNumeroCivicoModel?.lettera || "",
  esponente1: tipoNumeroCivicoModel?.esponente1 || "",
  colore: tipoNumeroCivicoModel?.colore || "",
  civicoInterno: apiTipoCivicoInternoToTipoCivicoInternoModel(
    tipoNumeroCivicoModel?.civicoInterno
  ),
});

export const apiTipoIndirizzoToTipoIndirizzoModel = (
  tipoIndirizzo: TipoIndirizzo | undefined
): TipoIndirizzoModel => ({
  cap: tipoIndirizzo?.cap || "",
  comune: apiTipoComuneToTipoComuneModel(tipoIndirizzo?.comune),
  frazione: tipoIndirizzo?.frazione || "",
  toponimo: apiTipoToponimoToTipoToponimoModel(tipoIndirizzo?.toponimo),
  numeroCivico: apiTipoNumeroCivicoToTipoNumeroCivicoModel(
    tipoIndirizzo?.numeroCivico
  ),
});

export const apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel = (
  tipoDatoLocalitaEstera: TipoDatoLocalitaEstera | undefined
): TipoDatoLocalitaEsteraModel => ({
  descrizioneLocalita: tipoDatoLocalitaEstera?.descrizioneLocalita || "",
  descrizioneStato: tipoDatoLocalitaEstera?.descrizioneStato || "",
  codiceStato: tipoDatoLocalitaEstera?.codiceStato || "",
  provinciaContea: tipoDatoLocalitaEstera?.provinciaContea || "",
});

export const apiTipoToponimoEsteroToTipoToponimoEsteroModel = (
  tipoToponimoEstero: TipoToponimoEstero | undefined
): TipoToponimoEsteroModel => ({
  denominazione: tipoToponimoEstero?.denominazione || "",
  numeroCivico: tipoToponimoEstero?.numeroCivico || "",
});

export const apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel = (
  tipoIndirizzoEstero: TipoIndirizzoEstero | undefined
): TipoIndirizzoEsteroModel => ({
  cap: tipoIndirizzoEstero?.cap || "",
  localita: apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel(
    tipoIndirizzoEstero?.localita
  ),
  toponimo: apiTipoToponimoEsteroToTipoToponimoEsteroModel(
    tipoIndirizzoEstero?.toponimo
  ),
});

export const apiTipoConsolatoToTipoConsolatoModel = (
  tipoConsolato: TipoConsolato | undefined
): TipoConsolatoModel => ({
  codiceConsolato: tipoConsolato?.codiceConsolato || "",
  descrizioneConsolato: tipoConsolato?.descrizioneConsolato || "",
});

export const apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel = (
  tipoLocalitaEstera: TipoLocalitaEstera1 | undefined
): TipoLocalitaEsteraModel => ({
  indirizzoEstero: apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel(
    tipoLocalitaEstera?.indirizzoEstero
  ),
  consolato: apiTipoConsolatoToTipoConsolatoModel(
    tipoLocalitaEstera?.consolato
  ),
});

export const apiTipoResidenzaToTipoResidenzaModel = (
  tipoResidenza: TipoResidenza | undefined
): TipoResidenzaModel => ({
  tipoIndirizzo: tipoResidenza?.tipoIndirizzo || "",
  noteIndirizzo: tipoResidenza?.noteIndirizzo || "",
  indirizzo: apiTipoIndirizzoToTipoIndirizzoModel(tipoResidenza?.indirizzo),
  localitaEstera: apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel(
    tipoResidenza?.localitaEstera
  ),
  presso: tipoResidenza?.presso || "",
  dataDecorrenzaResidenza: tipoResidenza?.dataDecorrenzaResidenza || "",
});

export const apiDataPreparationTemplateToUserModel = (
  dataPreparationTemplate: DataPreparationTemplate | undefined,
  existingUUID?: string
): UserModel => ({
  uuid:
    existingUUID &&
    typeof existingUUID === "string" &&
    isValidUUID(existingUUID)
      ? existingUUID
      : generateRandomUUID(),
  soggetto: apiTipoCriteriRicercaTemplateAR001ToSoggettoModel(
    dataPreparationTemplate?.soggetto
  ),
  residenza: apiTipoResidenzaToTipoResidenzaModel(
    dataPreparationTemplate?.residenza
  ),
});

export const userModelToApiDataPreparationResponse = (
  userModel: UserModel | undefined
): DataPreparationResponse => ({
  uuid: userModel?.uuid,
});

export const userModelToApiDataPreparationResponseCf = (
  userModels: UserModel[] | null,
  codiceFiscale?: string | null
): DataPreparationResponse | null => {
  if (!userModels || userModels.length === 0) {
    return null; // Return undefined if the list of UserModel is empty or undefined
  }

  if (!codiceFiscale) {
    return null; // Return undefined if the list of UserModel is empty or undefined
  }
  // Find the UserModel with the specified codice fiscale
  const userModel = getUserModelByCodiceFiscale(userModels, codiceFiscale);

  if (!userModel) {
    return null; // Return undefined if UserModel with the specified codice fiscale is not found
  }

  // Return DataPreparationResponse with the uuid from the found UserModel
  return {
    uuid: userModel.uuid,
  };
};

//* ********************************************************************************************************** */
export const tipoComuneModelToApiTipoComune = (
  tipoComuneModel: TipoComuneModel
): TipoComune => ({
  nomeComune: tipoComuneModel?.nomeComune,
  codiceIstat: tipoComuneModel?.codiceIstat,
  siglaProvinciaIstat: tipoComuneModel?.siglaProvinciaIstat,
  descrizioneLocalita: tipoComuneModel?.descrizioneLocalita,
});

export const tipoLocalitaModelToApiTipoLocalita = (
  tipoLocalitaModel: TipoLocalitaModel
): TipoLocalita => ({
  descrizioneLocalita: tipoLocalitaModel?.descrizioneLocalita,
  descrizioneStato: tipoLocalitaModel?.descrizioneStato,
  codiceStato: tipoLocalitaModel?.codiceStato,
  provinciaContea: tipoLocalitaModel?.provinciaContea,
});
export const tipoLuogoNascitaModelToApiTipoLuogoNascita = (
  tipoLuogoNascitaModel: TipoLuogoNascitaModel
): TipoLuogoNascitaE000 => ({
  luogoEccezionale: tipoLuogoNascitaModel?.luogoEccezionale,
  comune: tipoComuneModelToApiTipoComune(tipoLuogoNascitaModel?.comune),
  localita: tipoLocalitaModelToApiTipoLocalita(tipoLuogoNascitaModel?.localita),
});

export const tipoDataNascitaModelToApiTipoDatiNascitaTemplateE000 = (
  tipoDataNascitaModel: TipoDataNascitaModel
): TipoDatiNascitaTemplateE000 => ({
  dataEvento: tipoDataNascitaModel?.dataEvento,
  luogoNascita: tipoLuogoNascitaModelToApiTipoLuogoNascita(
    tipoDataNascitaModel?.luogoNascita
  ),
});

export const soggettoModelToApiTipoCriteriRicercaTemplateAR001 = (
  soggettoModel: SoggettoModel
): TipoCriteriRicercaTemplateAR001 => ({
  codiceFiscale: soggettoModel?.codiceFiscale,
  id: soggettoModel?.id,
  cognome: soggettoModel?.cognome,
  nome: soggettoModel?.nome,
  sesso: soggettoModel?.sesso,
  datiNascita: tipoDataNascitaModelToApiTipoDatiNascitaTemplateE000(
    soggettoModel?.datiNascita
  ),
});

export const tipoToponimoModelToApiTipoToponimo = (
  tipoToponimoModel: TipoToponimoModel
): TipoToponimo => ({
  codSpecie: tipoToponimoModel?.codSpecie,
  specie: tipoToponimoModel?.specie,
  specieFonte: tipoToponimoModel?.specieFonte,
  codToponimo: tipoToponimoModel?.codToponimo,
  denominazioneToponimo: tipoToponimoModel?.denominazioneToponimo,
  toponimoFonte: tipoToponimoModel?.toponimoFonte,
});

export const tipoCivicoInternoModelToApiTipoCivicoInterno = (
  tipoCivicoInternoModel: TipoCivicoInternoModel
): TipoCivicoInterno => ({
  corte: tipoCivicoInternoModel?.corte,
  scala: tipoCivicoInternoModel?.scala,
  interno1: tipoCivicoInternoModel?.interno1,
  espInterno1: tipoCivicoInternoModel?.espInterno1,
  interno2: tipoCivicoInternoModel?.interno2,
  espInterno2: tipoCivicoInternoModel?.espInterno2,
  scalaEsterna: tipoCivicoInternoModel?.scalaEsterna,
  secondario: tipoCivicoInternoModel?.secondario,
  piano: tipoCivicoInternoModel?.piano,
  nui: tipoCivicoInternoModel?.nui,
  isolato: tipoCivicoInternoModel?.isolato,
});

export const tipoNumeroCivicoModelToApiTipoNumeroCivico = (
  tipoNumeroCivicoModel: TipoNumeroCivicoModel
): TipoNumeroCivico => ({
  codiceCivico: tipoNumeroCivicoModel?.codiceCivico,
  civicoFonte: tipoNumeroCivicoModel?.civicoFonte,
  numero: tipoNumeroCivicoModel?.numero,
  metrico: tipoNumeroCivicoModel?.metrico,
  progSNC: tipoNumeroCivicoModel?.progSNC,
  lettera: tipoNumeroCivicoModel?.lettera,
  esponente1: tipoNumeroCivicoModel?.esponente1,
  colore: tipoNumeroCivicoModel?.colore,
  civicoInterno: tipoCivicoInternoModelToApiTipoCivicoInterno(
    tipoNumeroCivicoModel?.civicoInterno
  ),
});

export const tipoIndirizzoModelToApiTipoIndirizzo = (
  tipoIndirizzoModel: TipoIndirizzoModel
): TipoIndirizzo => ({
  cap: tipoIndirizzoModel?.cap,
  comune: tipoComuneModelToApiTipoComune(tipoIndirizzoModel?.comune),
  frazione: tipoIndirizzoModel?.frazione,
  toponimo: tipoToponimoModelToApiTipoToponimo(tipoIndirizzoModel?.toponimo),
  numeroCivico: tipoNumeroCivicoModelToApiTipoNumeroCivico(
    tipoIndirizzoModel?.numeroCivico
  ),
});

export const tipoDatoLocalitaEsteraModelToApiTipoDatoLocalitaEstera = (
  tipoDatoLocalitaEsteraModel: TipoDatoLocalitaEsteraModel
): TipoDatoLocalitaEstera => ({
  descrizioneLocalita: tipoDatoLocalitaEsteraModel?.descrizioneLocalita,
  descrizioneStato: tipoDatoLocalitaEsteraModel?.descrizioneStato,
  codiceStato: tipoDatoLocalitaEsteraModel?.codiceStato,
  provinciaContea: tipoDatoLocalitaEsteraModel?.provinciaContea,
});

export const tipoToponimoEsteroModelToApiTipoToponimoEstero = (
  tipoToponimoEsteroModel: TipoToponimoEsteroModel
): TipoToponimoEstero => ({
  denominazione: tipoToponimoEsteroModel?.denominazione,
  numeroCivico: tipoToponimoEsteroModel?.numeroCivico,
});

export const tipoIndirizzoEsteroModelToApiTipoIndirizzoEstero = (
  tipoIndirizzoEsteroModel: TipoIndirizzoEsteroModel
): TipoIndirizzoEstero => ({
  cap: tipoIndirizzoEsteroModel?.cap,
  localita: tipoDatoLocalitaEsteraModelToApiTipoDatoLocalitaEstera(
    tipoIndirizzoEsteroModel?.localita
  ),
  toponimo: tipoToponimoEsteroModelToApiTipoToponimoEstero(
    tipoIndirizzoEsteroModel?.toponimo
  ),
});

export const tipoConsolatoModelToApiTipoConsolato = (
  tipoConsolatoModel: TipoConsolatoModel
): TipoConsolato => ({
  codiceConsolato: tipoConsolatoModel?.codiceConsolato,
  descrizioneConsolato: tipoConsolatoModel?.descrizioneConsolato,
});

export const tipoLocalitaEsteraModelToApiTipoLocalitaEstera1 = (
  tipoLocalitaEsteraModel: TipoLocalitaEsteraModel
): TipoLocalitaEstera1 => ({
  indirizzoEstero: tipoIndirizzoEsteroModelToApiTipoIndirizzoEstero(
    tipoLocalitaEsteraModel?.indirizzoEstero
  ),
  consolato: tipoConsolatoModelToApiTipoConsolato(
    tipoLocalitaEsteraModel?.consolato
  ),
});
export const tipoResidenzaModelToApiTipoResidenza = (
  tipoResidenzaModel: TipoResidenzaModel
): TipoResidenza => ({
  tipoIndirizzo: tipoResidenzaModel?.tipoIndirizzo,
  noteIndirizzo: tipoResidenzaModel?.noteIndirizzo,
  indirizzo: tipoIndirizzoModelToApiTipoIndirizzo(tipoResidenzaModel?.indirizzo),
  localitaEstera: tipoLocalitaEsteraModelToApiTipoLocalitaEstera1(
    tipoResidenzaModel?.localitaEstera
  ),
  presso: tipoResidenzaModel?.presso,
  dataDecorrenzaResidenza: tipoResidenzaModel?.dataDecorrenzaResidenza,
});

export const userModelToApiDataPreparationTemplate = (
  userModel: UserModel
): DataPreparationTemplate => ({
  soggetto: soggettoModelToApiTipoCriteriRicercaTemplateAR001(
    userModel?.soggetto
  ),
  residenza: tipoResidenzaModelToApiTipoResidenza(userModel?.residenza),
});

export const userModelToApiDataPreparationTemplateResponse = (
  userModel: UserModel
): DataPreparationTemplateResponse => ({
  uuid: userModel?.uuid,
  soggetto: soggettoModelToApiTipoCriteriRicercaTemplateAR001(
    userModel?.soggetto
  ),
  residenza: tipoResidenzaModelToApiTipoResidenza(userModel?.residenza),
});


//* ********************************************************************************************************** */


export const TipoDatiNascitaModelToApiTipoDatiNascita = (
  tipoDatiNascitaModel: TipoDatiNascitaModel
): TipoDatiNascitaE000 => ({
  dataEvento: tipoDatiNascitaModel?.dataEvento,
  senzaGiorno:  tipoDatiNascitaModel?.senzaGiorno,
  senzaGiornoMese:  tipoDatiNascitaModel?.senzaGiornoMese,
  luogoNascita: tipoDatiNascitaModel?.luogoNascita
});


export const TipoParametriRicercaModelToApiTipoParametriRicerca = (
  tipoParametriRicercaModel: TipoParametriRicercaModel
): TipoParametriRicercaAR001 => ({
  codiceFiscale: tipoParametriRicercaModel?.codiceFiscale ,
  id: tipoParametriRicercaModel?.id ,
  cognome: tipoParametriRicercaModel?.cognome ,
  senzaCognome: tipoParametriRicercaModel?.senzaCognome ,
  nome: tipoParametriRicercaModel?.nome ,
  senzaNome: tipoParametriRicercaModel?.senzaNome ,
  sesso: tipoParametriRicercaModel?.sesso ,
  datiNascita: tipoParametriRicercaModel?.datiNascita ,
});

export const TipoRichiestaModelModelToApiTipoRichiesta = (
  tipoRichiestaModel: TipoRichiestaModel
): TipoRichiestaAR001 => ({
  dataRiferimentoRichiesta: tipoRichiestaModel?.dataRiferimentoRichiesta,
  motivoRichiesta: tipoRichiestaModel.motivoRichiesta,
  casoUso: tipoRichiestaModel.casoUso,
});

export const RichiestaModelToApiRichiestaAR001 = (
  tipoRichiestaModel: RichiestaModel
): RichiestaAR001 => ({
  idOperazioneClient: tipoRichiestaModel?.idOperazioneClient,
  parametriRicerca: tipoRichiestaModel?.parametriRicerca,
  richiesta: tipoRichiestaModel?.richiesta,
});

export const TipoCodiceFiscaleModelToApiTipoCodiceFiscale = (
  tipoCodiceFiscaleModel: TipoCodiceFiscaleModel
): TipoCodiceFiscale => ({
    codFiscale: tipoCodiceFiscaleModel?.codFiscale,
    validitaCF: tipoCodiceFiscaleModel?.validitaCF,
    dataAttribuzioneValidita:tipoCodiceFiscaleModel?.dataAttribuzioneValidita
});

export const TipoLuogoEventoModelToApiTipoLuogoEvento = (
  tipoLuogoEventoModel: TipoLuogoEventoModel
): TipoLuogoEvento => ({
  luogoEccezionale: tipoLuogoEventoModel?.luogoEccezionale,
  comune: tipoLuogoEventoModel?.comune,
  localita:tipoLuogoEventoModel?.localita
});

export const TipoIdSchedaSoggettoComuneModelToApiTipoIdSchedaSoggettoComune = (
  tipoLuogoEventoModel: TipoIdSchedaSoggettoComuneModel
): TipoIdSchedaSoggettoComune => ({
  idSchedaSoggettoComuneIstat: tipoLuogoEventoModel?.idSchedaSoggettoComuneIstat,
  idSchedaSoggetto: tipoLuogoEventoModel?.idSchedaSoggetto,
});

export const TipoGeneralitaModelToApiTipoGeneralita = (
  tipoGeneralitaModel: TipoGeneralitaModel
): TipoGeneralita => ({
  codiceFiscale: tipoGeneralitaModel?.codiceFiscale,
  cognome: tipoGeneralitaModel?.cognome,
  senzaCognome: tipoGeneralitaModel?.senzaCognome,
  nome: tipoGeneralitaModel?.nome,
  senzaNome: tipoGeneralitaModel?.senzaNome,
  sesso: tipoGeneralitaModel?.sesso,
  dataNascita: tipoGeneralitaModel?.dataNascita,
  senzaGiorno: tipoGeneralitaModel?.senzaGiorno,
  senzaGiornoMese: tipoGeneralitaModel?.senzaGiornoMese,
  luogoNascita: tipoGeneralitaModel?.luogoNascita,
  soggettoAIRE: tipoGeneralitaModel?.soggettoAIRE,
  annoEspatrio: tipoGeneralitaModel?.annoEspatrio,
  idSchedaSoggettoComune: tipoGeneralitaModel?.idSchedaSoggettoComune,
  idSchedaSoggetto: tipoGeneralitaModel?.idSchedaSoggetto,
  note: tipoGeneralitaModel?.note,
});

/******************************************************************************** */
/*
 
 
export const TipoGeneralitaModel = z
.object({
  codiceFiscale: TipoCodiceFiscaleModel,
  cognome: z.string(),
  senzaCognome: z.string(),
  nome: z.string(),
  senzaNome: z.string(),
  sesso: z.string(),
  dataNascita: z.string(),
  senzaGiorno: z.string(),
  senzaGiornoMese: z.string(),
  luogoNascita: TipoLuogoEventoModel,
  soggettoAIRE: z.string(),
  annoEspatrio: z.string(),
  idSchedaSoggettoComune: TipoIdSchedaSoggettoComuneModel,
  idSchedaSoggetto: z.string(),
  note: z.string(),
})
.partial()
.passthrough();
export type TipoGeneralitaModel = z.infer<typeof TipoGeneralitaModel>;



export const TipoIdentificativiModel = z
.object({
  id: z.string() 
})
.partial()
.passthrough();
export type TipoIdentificativiModel = z.infer<typeof TipoIdentificativiModel>;

export const TipoAttoModel = z
.object({
  comuneRegistrazione: TipoComuneModel,
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
export type TipoAttoModel = z.infer<typeof TipoAttoModel>;



export const TipoAttoANSCModel = z
.object({
  idANSC: z.string(),
  comuneRegistrazione: TipoComuneModel,
  anno: z.string(),
  ufficioMunicipio: z.string(),
  numeroComunale: z.string(),
  dataFormazioneAtto: z.string(),
  trascritto: z.string(),
})
.partial()
.passthrough();
export type TipoAttoANSCModel = z.infer<typeof TipoAttoANSCModel>;


export const TipoAttoEventoModel = z
.object({
  atto: TipoAttoModel,
  attoANSC: TipoAttoANSCModel
})
.partial()
.passthrough();
export type TipoAttoEventoModel = z.infer<typeof TipoAttoEventoModel>;




export const TipoDatiEventoModel = z
.object({
  dataEvento: z.string(),
  senzaGiorno: z.string(),
  senzaGiornoMese: z.string(),
  luogoEvento: TipoLuogoEventoModel,
  attoEvento: TipoAttoEventoModel,
})
.partial()
.passthrough();
export type TipoDatiEventoModel = z.infer<typeof TipoDatiEventoModel>;

export const TipoDatiSoggettiEnteModel = z
.object({
  generalita: TipoGeneralitaModel,
  residenza: z.array(TipoResidenzaModel),
  identificativi: TipoIdentificativiModel,
  datiDecesso: TipoDatiEventoModel,
})
.partial()
.passthrough();
export type TipoDatiSoggettiEnteModel = z.infer<typeof TipoDatiSoggettiEnteModel>;

export const TipoListaSoggettiModel = z
.object({
  soggetto: z.array(TipoDatiSoggettiEnteModel)
})
.partial()
.passthrough();
export type TipoListaSoggettiModel = z.infer<typeof TipoListaSoggettiModel>;

export const TipoErroriAnomaliaModel = z
.object({
  codiceErroreAnomalia: z.string(),
    tipoErroreAnomalia: z.string(),
    testoErroreAnomalia: z.string(),
    oggettoErroreAnomalia: z.string(),
    campoErroreAnomalia: z.string(),
    valoreErroreAnomalia: z.string(),})
.partial()
.passthrough();
export type TipoErroriAnomaliaModel = z.infer<typeof TipoErroriAnomaliaModel>;

export const RispostaAR001Model = z
.object({
  idOperazione: z.string(),
  //soggetti: TipoListaSoggettiModel,
  listaAnomalie: z.array(TipoErroriAnomaliaModel),
})
.partial()
.passthrough();
export type RispostaAR001Model = z.infer<typeof RispostaAR001Model>;

export const ProblemErrorModel = z
.object({
  code: z.string(), detail: z.string()
})
.partial()
.passthrough();
export type ProblemErrorModel = z.infer<typeof ProblemErrorModel>;

export const ProblemModel = z
.object({
  type: z.string(),
  status: z.number().int(),
  title: z.string(),
  correlationId: z.string().optional(),
  detail: z.string().optional(),
  errors: z.array(ProblemErrorModel).min(1),
})
.passthrough();
export type ProblemModel = z.infer<typeof ProblemModel>; */
