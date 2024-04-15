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


export const TipoIdentificativiModelToApiTipoIdentificativi = (
  tipoIdentificativiModel: TipoIdentificativiModel
): TipoIdentificativi => ({
  id: tipoIdentificativiModel?.id
});

export const TipoAttoModelToApiTipoAtto = (
  tipoAttoModel: TipoAttoModel
): TipoAtto => ({
  comuneRegistrazione: tipoAttoModel?.comuneRegistrazione,
  ufficioMunicipio: tipoAttoModel?.ufficioMunicipio,
  anno: tipoAttoModel?.anno,
  parte: tipoAttoModel?.parte,
  serie: tipoAttoModel?.serie,
  numeroAtto: tipoAttoModel?.numeroAtto,
  volume: tipoAttoModel?.volume,
  dataFormazioneAtto: tipoAttoModel?.dataFormazioneAtto,
  trascritto: tipoAttoModel?.trascritto,
});

export const TipoAttoANSCModelToApiTipoAttoANSC = (
  tipoAttoANSCModel: TipoAttoANSCModel
): TipoAttoANSC => ({
  idANSC: tipoAttoANSCModel?.idANSC,
  comuneRegistrazione: tipoAttoANSCModel?.comuneRegistrazione,
  anno: tipoAttoANSCModel?.anno,
  ufficioMunicipio: tipoAttoANSCModel?.ufficioMunicipio,
  numeroComunale: tipoAttoANSCModel?.numeroComunale,
  dataFormazioneAtto: tipoAttoANSCModel?.dataFormazioneAtto,
  trascritto: tipoAttoANSCModel?.trascritto,
});

export const TipoAttoEventoModelToApiTipoAttoEvento = (
  tipoDatiEvento: TipoAttoEventoModel
): TipoAttoEvento => ({
  atto: tipoDatiEvento?.atto,
  attoANSC: tipoDatiEvento?.attoANSC,
});


export const TipoDatiEventoModelToApiTipoDatiEvento = (
  tipoDatiEvento: TipoDatiEventoModel
): TipoDatiEvento => ({
  dataEvento: tipoDatiEvento?.dataEvento,
  senzaGiorno: tipoDatiEvento?.senzaGiorno,
  senzaGiornoMese: tipoDatiEvento?.senzaGiorno,
  luogoEvento: tipoDatiEvento?.luogoEvento,
  attoEvento: tipoDatiEvento?.attoEvento,
});

export const TipoDatiSoggettiEnteModelToApiTipoDatiSoggettiEnte = (
  tipoDatiSoggettiEnteModel: TipoDatiSoggettiEnteModel
): TipoDatiSoggettiEnte => ({
  generalita: tipoDatiSoggettiEnteModel?.generalita,
  residenza: tipoDatiSoggettiEnteModel?.residenza,
  identificativi: tipoDatiSoggettiEnteModel?.identificativi,,
  datiDecesso: tipoDatiSoggettiEnteModel?.datiDecesso,,
});

export const TipoListaSoggettiModelToApiTipoListaSoggetti = (
  tipoListaSoggettiModel: TipoListaSoggettiModel
): TipoListaSoggetti => ({
  soggetto: tipoListaSoggettiModel?.soggetto
});


export const TipoErroriAnomaliaModelToApiTipoErroriAnomalia = (
  tipoErroriAnomaliaModel: TipoErroriAnomaliaModel
): TipoErroriAnomalia => ({
  codiceErroreAnomalia: tipoErroriAnomaliaModel?.campoErroreAnomalia,
  tipoErroreAnomalia: tipoErroriAnomaliaModel?.tipoErroreAnomalia,
  testoErroreAnomalia: tipoErroriAnomaliaModel?.testoErroreAnomalia,
  oggettoErroreAnomalia: tipoErroriAnomaliaModel?.oggettoErroreAnomalia,
  campoErroreAnomalia: tipoErroriAnomaliaModel?.campoErroreAnomalia,
  valoreErroreAnomalia: tipoErroriAnomaliaModel?.valoreErroreAnomalia,
});


export const RispostaAR001ModelToApiRispostaAR001 = (
  rispostaAR001Model: RispostaAR001Model
): RispostaAR001 => ({
  idOperazione: rispostaAR001Model?.idOperazione,
  //soggetti: rispostaAR001Model?.soggetti,
  listaAnomalie: rispostaAR001Model?.listaAnomalie,
});

export const ProblemErrorModelToApiProblemError = (
  problemErrorModel: ProblemErrorModel
): ProblemError => ({
  code: problemErrorModel?.code,
  detail: problemErrorModel?.detail
});

export const ProblemModelToApiProblem= (
  problemModel: ProblemModel
): Problem => ({
  type: problemModel?.type,
  status: problemModel?.status,
  title: problemModel?.title,
  correlationId: problemModel?.correlationId,
  detail: problemModel?.detail,
  errors: problemModel?.errors,
});
