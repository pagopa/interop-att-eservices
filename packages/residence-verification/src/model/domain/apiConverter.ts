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
  // RispostaAR001Model,
  ProblemErrorModel,
  ProblemModel,
} from "pdnd-models";
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
  // RispostaAR001,
  ProblemError,
  Problem,
} from "./models.js";

export const apiTipoComuneToTipoComuneModel = (
  tipoComune: TipoComune | undefined
): TipoComuneModel => ({
  nameMunicipality: tipoComune?.nameMunicipality || "",
  istatCode: tipoComune?.istatCode || "",
  acronymIstatProvince: tipoComune?.acronymIstatProvince || "",
  placeDescription: tipoComune?.placeDescription || "",
});

export const apiTipoLocalitaToTipoLocalita = (
  tipoLocalita: TipoLocalita | undefined
): TipoLocalitaModel => ({
  placeDescription: tipoLocalita?.placeDescription || "",
  countryDescription: tipoLocalita?.countryDescription || "",
  codState: tipoLocalita?.codState || "",
  provinceCounty: tipoLocalita?.provinceCounty || "",
});

export const apiTipoLuogoNascitaToTipoLuogoNascitaModel = (
  tipoLuogoNascitaE000: TipoLuogoNascitaE000 | undefined
): TipoLuogoNascitaModel => ({
  exceptionalPlace: tipoLuogoNascitaE000?.exceptionalPlace || "",
  municipality: apiTipoComuneToTipoComuneModel(tipoLuogoNascitaE000?.municipality),
  place: apiTipoLocalitaToTipoLocalita(tipoLuogoNascitaE000?.place),
});

export const apiTipoDatiNascitaTemplateE000ToTipoDataNascitaModel = (
  tipoDatiNascitaTemplateE000: TipoDatiNascitaTemplateE000 | undefined
): TipoDataNascitaModel => ({
  eventDate: tipoDatiNascitaTemplateE000?.eventDate || "",
  birthPlace: apiTipoLuogoNascitaToTipoLuogoNascitaModel(
    tipoDatiNascitaTemplateE000?.birthPlace
  ),
});

export const apiTipoCriteriRicercaTemplateAR001ToSoggettoModel = (
  tipoCriteriRicercaTemplateAR001: TipoCriteriRicercaTemplateAR001 | undefined
): SoggettoModel => ({
  fiscalCode: tipoCriteriRicercaTemplateAR001?.fiscalCode || "",
  id: tipoCriteriRicercaTemplateAR001?.id || "",
  surname: tipoCriteriRicercaTemplateAR001?.surname || "",
  name: tipoCriteriRicercaTemplateAR001?.name || "",
  gender: tipoCriteriRicercaTemplateAR001?.gender || "",
  birthDate: apiTipoDatiNascitaTemplateE000ToTipoDataNascitaModel(
    tipoCriteriRicercaTemplateAR001?.birthDate
  ),
});

export const apiTipoToponimoToTipoToponimoModel = (
  tipoToponimo: TipoToponimo | undefined
): TipoToponimoModel => ({
  codType: tipoToponimo?.codType || "",
  type: tipoToponimo?.type || "",
  originType: tipoToponimo?.originType || "",
  toponymCod: tipoToponimo?.toponymCod || "",
  toponymDenomination: tipoToponimo?.toponymDenomination || "",
  toponymSource: tipoToponimo?.toponymSource || "",
});

export const apiTipoCivicoInternoToTipoCivicoInternoModel = (
  tipoCivicoInterno: TipoCivicoInterno | undefined
): TipoCivicoInternoModel => ({
  court: tipoCivicoInterno?.court || "",
  stairs: tipoCivicoInterno?.stairs || "",
  internal1: tipoCivicoInterno?.internal1 || "",
  espInternal1: tipoCivicoInterno?.espInternal1 || "",
  internal2: tipoCivicoInterno?.internal2 || "",
  espInternal2: tipoCivicoInterno?.espInternal2 || "",
  externalStairs: tipoCivicoInterno?.externalStairs || "",
  secondary: tipoCivicoInterno?.secondary || "",
  floor: tipoCivicoInterno?.floor || "",
  nui: tipoCivicoInterno?.nui || "",
  isolated: tipoCivicoInterno?.isolated || "",
});

export const apiTipoNumeroCivicoToTipoNumeroCivicoModel = (
  tipoNumeroCivicoModel: TipoNumeroCivico | undefined
): TipoNumeroCivicoModel => ({
  civicCod: tipoNumeroCivicoModel?.civicCod || "",
  civicSource: tipoNumeroCivicoModel?.civicSource || "",
  number: tipoNumeroCivicoModel?.number || "",
  metric: tipoNumeroCivicoModel?.metric || "",
  progSNC: tipoNumeroCivicoModel?.progSNC || "",
  letter: tipoNumeroCivicoModel?.letter || "",
  exponent1: tipoNumeroCivicoModel?.exponent1 || "",
  color: tipoNumeroCivicoModel?.color || "",
  internalCivic: apiTipoCivicoInternoToTipoCivicoInternoModel(
    tipoNumeroCivicoModel?.internalCivic
  ),
});

export const apiTipoIndirizzoToTipoIndirizzoModel = (
  tipoIndirizzo: TipoIndirizzo | undefined
): TipoIndirizzoModel => ({
  cap: tipoIndirizzo?.cap || "",
  municipality: apiTipoComuneToTipoComuneModel(tipoIndirizzo?.municipality),
  fraction: tipoIndirizzo?.fraction || "",
  toponym: apiTipoToponimoToTipoToponimoModel(tipoIndirizzo?.toponym),
  civicNumber: apiTipoNumeroCivicoToTipoNumeroCivicoModel(
    tipoIndirizzo?.civicNumber
  ),
});

export const apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel = (
  tipoDatoLocalitaEstera: TipoDatoLocalitaEstera | undefined
): TipoDatoLocalitaEsteraModel => ({
  placeDescription: tipoDatoLocalitaEstera?.placeDescription || "",
  countryDescription: tipoDatoLocalitaEstera?.countryDescription || "",
  provinceCounty: tipoDatoLocalitaEstera?.provinceCounty || "",
  countryState: tipoDatoLocalitaEstera?.countryState || "",
});

export const apiTipoToponimoEsteroToTipoToponimoEsteroModel = (
  tipoToponimoEstero: TipoToponimoEstero | undefined
): TipoToponimoEsteroModel => ({
  denomination: tipoToponimoEstero?.denomination || "",
  civicNumber: tipoToponimoEstero?.civicNumber || "",
});

export const apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel = (
  tipoIndirizzoEstero: TipoIndirizzoEstero | undefined
): TipoIndirizzoEsteroModel => ({
  cap: tipoIndirizzoEstero?.cap || "",
  place: apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel(
    tipoIndirizzoEstero?.place
  ),
  toponym: apiTipoToponimoEsteroToTipoToponimoEsteroModel(
    tipoIndirizzoEstero?.toponym
  ),
});

export const apiTipoConsolatoToTipoConsolatoModel = (
  tipoConsolato: TipoConsolato | undefined
): TipoConsolatoModel => ({
  consulateCod: tipoConsolato?.consulateCod || "",
  consulateDescription: tipoConsolato?.consulateDescription || "",
});

export const apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel = (
  tipoLocalitaEstera: TipoLocalitaEstera1 | undefined
): TipoLocalitaEsteraModel => ({
  foreignAddress: apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel(
    tipoLocalitaEstera?.foreignAddress
  ),
  consulate: apiTipoConsolatoToTipoConsolatoModel(
    tipoLocalitaEstera?.consulate
  ),
});

export const apiTipoResidenzaToTipoResidenzaModel = (
  tipoResidenza: TipoResidenza | undefined
): TipoResidenzaModel => ({
  addressType: tipoResidenza?.addressType || "",
  noteaddress: tipoResidenza?.noteaddress || "",
  address: apiTipoIndirizzoToTipoIndirizzoModel(tipoResidenza?.address),
  foreignState: apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel(
    tipoResidenza?.foreignState
  ),
  presso: tipoResidenza?.presso || "",
  addressStartDate: tipoResidenza?.addressStartDate || "",
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
  subject: apiTipoCriteriRicercaTemplateAR001ToSoggettoModel(
    dataPreparationTemplate?.subject
  ),
  address: apiTipoResidenzaToTipoResidenzaModel(
    dataPreparationTemplate?.address
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
  nameMunicipality: tipoComuneModel?.nameMunicipality,
  istatCode: tipoComuneModel?.istatCode,
  acronymIstatProvince: tipoComuneModel?.acronymIstatProvince,
  placeDescription: tipoComuneModel?.placeDescription,
});

export const tipoLocalitaModelToApiTipoLocalita = (
  tipoLocalitaModel: TipoLocalitaModel
): TipoLocalita => ({
  placeDescription: tipoLocalitaModel?.placeDescription,
  countryDescription: tipoLocalitaModel?.countryDescription,
  codState: tipoLocalitaModel?.codState,
  provinceCounty: tipoLocalitaModel?.provinceCounty,
});
export const tipoLuogoNascitaModelToApiTipoLuogoNascita = (
  tipoLuogoNascitaModel: TipoLuogoNascitaModel
): TipoLuogoNascitaE000 => ({
  exceptionalPlace: tipoLuogoNascitaModel?.exceptionalPlace,
  municipality: tipoComuneModelToApiTipoComune(tipoLuogoNascitaModel?.municipality),
  place: tipoLocalitaModelToApiTipoLocalita(tipoLuogoNascitaModel?.place),
});

export const tipoDataNascitaModelToApiTipoDatiNascitaTemplateE000 = (
  tipoDataNascitaModel: TipoDataNascitaModel
): TipoDatiNascitaTemplateE000 => ({
  eventDate: tipoDataNascitaModel?.eventDate,
  birthPlace: tipoLuogoNascitaModelToApiTipoLuogoNascita(
    tipoDataNascitaModel?.birthPlace
  ),
});

export const soggettoModelToApiTipoCriteriRicercaTemplateAR001 = (
  soggettoModel: SoggettoModel
): TipoCriteriRicercaTemplateAR001 => ({
  fiscalCode: soggettoModel?.fiscalCode,
  id: soggettoModel?.id,
  surname: soggettoModel?.surname,
  name: soggettoModel?.name,
  gender: soggettoModel?.gender,
  birthDate: tipoDataNascitaModelToApiTipoDatiNascitaTemplateE000(
    soggettoModel?.birthDate
  ),
});

export const tipoToponimoModelToApiTipoToponimo = (
  tipoToponimoModel: TipoToponimoModel
): TipoToponimo => ({
  codType: tipoToponimoModel?.codType,
  type: tipoToponimoModel?.type,
  originType: tipoToponimoModel?.originType,
  toponymCod: tipoToponimoModel?.toponymCod,
  toponymDenomination: tipoToponimoModel?.toponymDenomination,
  toponymSource: tipoToponimoModel?.toponymSource,
});

export const tipoCivicoInternoModelToApiTipoCivicoInterno = (
  tipoCivicoInternoModel: TipoCivicoInternoModel
): TipoCivicoInterno => ({
  court: tipoCivicoInternoModel?.court,
  stairs: tipoCivicoInternoModel?.stairs,
  internal1: tipoCivicoInternoModel?.internal1,
  espInternal1: tipoCivicoInternoModel?.espInternal1,
  internal2: tipoCivicoInternoModel?.internal2,
  espInternal2: tipoCivicoInternoModel?.espInternal2,
  externalStairs: tipoCivicoInternoModel?.externalStairs,
  secondary: tipoCivicoInternoModel?.secondary,
  floor: tipoCivicoInternoModel?.floor,
  nui: tipoCivicoInternoModel?.nui,
  isolated: tipoCivicoInternoModel?.isolated,
});

export const tipoNumeroCivicoModelToApiTipoNumeroCivico = (
  tipoNumeroCivicoModel: TipoNumeroCivicoModel
): TipoNumeroCivico => ({
  civicCod: tipoNumeroCivicoModel?.civicCod,
  civicSource: tipoNumeroCivicoModel?.civicSource,
  number: tipoNumeroCivicoModel?.number,
  metric: tipoNumeroCivicoModel?.metric,
  progSNC: tipoNumeroCivicoModel?.progSNC,
  letter: tipoNumeroCivicoModel?.letter,
  exponent1: tipoNumeroCivicoModel?.exponent1,
  color: tipoNumeroCivicoModel?.color,
  internalCivic: tipoCivicoInternoModelToApiTipoCivicoInterno(
    tipoNumeroCivicoModel?.internalCivic
  ),
});

export const tipoIndirizzoModelToApiTipoIndirizzo = (
  tipoIndirizzoModel: TipoIndirizzoModel
): TipoIndirizzo => ({
  cap: tipoIndirizzoModel?.cap,
  municipality: tipoComuneModelToApiTipoComune(tipoIndirizzoModel?.municipality),
  fraction: tipoIndirizzoModel?.fraction,
  toponym: tipoToponimoModelToApiTipoToponimo(tipoIndirizzoModel?.toponym),
  civicNumber: tipoNumeroCivicoModelToApiTipoNumeroCivico(
    tipoIndirizzoModel?.civicNumber
  ),
});

export const tipoDatoLocalitaEsteraModelToApiTipoDatoLocalitaEstera = (
  tipoDatoLocalitaEsteraModel: TipoDatoLocalitaEsteraModel
): TipoDatoLocalitaEstera => ({
  placeDescription: tipoDatoLocalitaEsteraModel?.placeDescription,
  countryDescription: tipoDatoLocalitaEsteraModel?.countryDescription,
  countryState: tipoDatoLocalitaEsteraModel?.countryState,
  provinceCounty: tipoDatoLocalitaEsteraModel?.provinceCounty,
});

export const tipoToponimoEsteroModelToApiTipoToponimoEstero = (
  tipoToponimoEsteroModel: TipoToponimoEsteroModel
): TipoToponimoEstero => ({
  denomination: tipoToponimoEsteroModel?.denomination,
  civicNumber: tipoToponimoEsteroModel?.civicNumber,
});

export const tipoIndirizzoEsteroModelToApiTipoIndirizzoEstero = (
  tipoIndirizzoEsteroModel: TipoIndirizzoEsteroModel
): TipoIndirizzoEstero => ({
  cap: tipoIndirizzoEsteroModel?.cap,
  place: tipoDatoLocalitaEsteraModelToApiTipoDatoLocalitaEstera(
    tipoIndirizzoEsteroModel?.place
  ),
  toponym: tipoToponimoEsteroModelToApiTipoToponimoEstero(
    tipoIndirizzoEsteroModel?.toponym
  ),
});

export const tipoConsolatoModelToApiTipoConsolato = (
  tipoConsolatoModel: TipoConsolatoModel
): TipoConsolato => ({
  consulateCod: tipoConsolatoModel?.consulateCod,
  consulateDescription: tipoConsolatoModel?.consulateDescription,
});

export const tipoLocalitaEsteraModelToApiTipoLocalitaEstera1 = (
  tipoLocalitaEsteraModel: TipoLocalitaEsteraModel
): TipoLocalitaEstera1 => ({
  foreignAddress: tipoIndirizzoEsteroModelToApiTipoIndirizzoEstero(
    tipoLocalitaEsteraModel?.foreignAddress
  ),
  consulate: tipoConsolatoModelToApiTipoConsolato(
    tipoLocalitaEsteraModel?.consulate
  ),
});
export const tipoResidenzaModelToApiTipoResidenza = (
  tipoResidenzaModel: TipoResidenzaModel
): TipoResidenza => ({
  addressType: tipoResidenzaModel?.addressType,
  noteaddress: tipoResidenzaModel?.noteaddress,
  address: tipoIndirizzoModelToApiTipoIndirizzo(
    tipoResidenzaModel?.address
  ),
  foreignState: tipoLocalitaEsteraModelToApiTipoLocalitaEstera1(
    tipoResidenzaModel?.foreignState
  ),
  presso: tipoResidenzaModel?.presso,
  addressStartDate: tipoResidenzaModel?.addressStartDate,
});

export const userModelToApiDataPreparationTemplate = (
  userModel: UserModel
): DataPreparationTemplate => ({
  subject: soggettoModelToApiTipoCriteriRicercaTemplateAR001(
    userModel?.subject
  ),
  address: tipoResidenzaModelToApiTipoResidenza(userModel?.address),
});

export const userModelToApiDataPreparationTemplateResponse = (
  userModel: UserModel
): DataPreparationTemplateResponse => ({
  uuid: userModel?.uuid,
  subject: soggettoModelToApiTipoCriteriRicercaTemplateAR001(
    userModel?.subject
  ),
  address: tipoResidenzaModelToApiTipoResidenza(userModel?.address),
});

//* ********************************************************************************************************** */

export const TipoDatiNascitaModelToApiTipoDatiNascita = (
  tipoDatiNascitaModel: TipoDatiNascitaModel
): TipoDatiNascitaE000 => ({
  eventDate: tipoDatiNascitaModel?.dataEvento,
  noDay: tipoDatiNascitaModel?.senzaGiorno,
  noMonth: tipoDatiNascitaModel?.senzaGiornoMese,
  birthPlace: tipoDatiNascitaModel?.luogoNascita,
});

export const TipoParametriRicercaModelToApiTipoParametriRicerca = (
  tipoParametriRicercaModel: TipoParametriRicercaModel
): TipoParametriRicercaAR001 => ({
  fiscalCode: tipoParametriRicercaModel?.codiceFiscale,
  id: tipoParametriRicercaModel?.id,
  surname: tipoParametriRicercaModel?.cognome,
  noSurname: tipoParametriRicercaModel?.senzaCognome,
  name: tipoParametriRicercaModel?.nome,
  noName: tipoParametriRicercaModel?.senzaNome,
  gender: tipoParametriRicercaModel?.sesso,
  birthDate: tipoParametriRicercaModel?.datiNascita,
});

export const TipoRichiestaModelModelToApiTipoRichiesta = (
  tipoRichiestaModel: TipoRichiestaModel
): TipoRichiestaAR001 => ({
  dateOfRequest: tipoRichiestaModel?.dateOfRequest,
  motivation: tipoRichiestaModel.motivation,
  useCase: tipoRichiestaModel.useCase,
});

export const RichiestaModelToApiRichiestaAR001 = (
  tipoRichiestaModel: RichiestaModel
): RichiestaAR001 => ({
  operationId: tipoRichiestaModel?.idOperazioneClient,
  criteria: tipoRichiestaModel?.parametriRicerca,
  requestData: tipoRichiestaModel?.richiesta,
});

export const TipoCodiceFiscaleModelToApiTipoCodiceFiscale = (
  tipoCodiceFiscaleModel: TipoCodiceFiscaleModel
): TipoCodiceFiscale => ({
  fiscalCode: tipoCodiceFiscaleModel?.codFiscale,
  fiscalCodeValidity: tipoCodiceFiscaleModel?.validitaCF,
  dataAttributionValidity: tipoCodiceFiscaleModel?.dataAttribuzioneValidita,
});

export const TipoLuogoEventoModelToApiTipoLuogoEvento = (
  tipoLuogoEventoModel: TipoLuogoEventoModel
): TipoLuogoEvento => ({
  exceptionalPlace: tipoLuogoEventoModel?.luogoEccezionale,
  municipality: tipoLuogoEventoModel?.comune,
  place: tipoLuogoEventoModel?.localita,
});

export const TipoIdSchedaSoggettoComuneModelToApiTipoIdSchedaSoggettoComune = (
  tipoLuogoEventoModel: TipoIdSchedaSoggettoComuneModel
): TipoIdSchedaSoggettoComune => ({
  idCommonSubjectDataIstat:
    tipoLuogoEventoModel?.idSchedaSoggettoComuneIstat,
    idSubjectData: tipoLuogoEventoModel?.idSchedaSoggetto,
});

export const TipoGeneralitaModelToApiTipoGeneralita = (
  tipoGeneralitaModel: TipoGeneralitaModel
): TipoGeneralita => ({
  fiscalCode: tipoGeneralitaModel?.codiceFiscale,
  surname: tipoGeneralitaModel?.cognome,
  noSurname: tipoGeneralitaModel?.senzaCognome,
  name: tipoGeneralitaModel?.nome,
  noName: tipoGeneralitaModel?.senzaNome,
  gender: tipoGeneralitaModel?.sesso,
  birthDate: tipoGeneralitaModel?.dataNascita,
  noDay: tipoGeneralitaModel?.senzaGiorno,
  noMonth: tipoGeneralitaModel?.senzaGiornoMese,
  birthPlace: tipoGeneralitaModel?.luogoNascita,
  AIRESubject: tipoGeneralitaModel?.soggettoAIRE,
  yearExpatriation: tipoGeneralitaModel?.annoEspatrio,
  idCommonSubjectData: tipoGeneralitaModel?.idSchedaSoggettoComune,
  idSubjectData: tipoGeneralitaModel?.idSchedaSoggetto,
  note: tipoGeneralitaModel?.note,
});

export const TipoIdentificativiModelToApiTipoIdentificativi = (
  tipoIdentificativiModel: TipoIdentificativiModel
): TipoIdentificativi => ({
  id: tipoIdentificativiModel?.id,
});

export const TipoAttoModelToApiTipoAtto = (
  tipoAttoModel: TipoAttoModel
): TipoAtto => ({
  municipalityRegistration: tipoAttoModel?.comuneRegistrazione,
  municipalOffice: tipoAttoModel?.ufficioMunicipio,
  year: tipoAttoModel?.anno,
  part: tipoAttoModel?.parte,
  series: tipoAttoModel?.serie,
  actNumber: tipoAttoModel?.numeroAtto,
  volume: tipoAttoModel?.volume,
  dateFormationAct: tipoAttoModel?.dataFormazioneAtto,
  transcribed: tipoAttoModel?.trascritto,
});

export const TipoAttoANSCModelToApiTipoAttoANSC = (
  tipoAttoANSCModel: TipoAttoANSCModel
): TipoAttoANSC => ({
  idANSC: tipoAttoANSCModel?.idANSC,
  municipalityRegistration: tipoAttoANSCModel?.comuneRegistrazione,
  act: tipoAttoANSCModel?.anno,
  municipalOffice: tipoAttoANSCModel?.ufficioMunicipio,
  municipalNumber: tipoAttoANSCModel?.numeroComunale,
  dateFormationAct: tipoAttoANSCModel?.dataFormazioneAtto,
  transcribed: tipoAttoANSCModel?.trascritto,
});

export const TipoAttoEventoModelToApiTipoAttoEvento = (
  tipoDatiEvento: TipoAttoEventoModel
): TipoAttoEvento => ({
  act: tipoDatiEvento?.atto,
  actANSC: tipoDatiEvento?.attoANSC,
});

export const TipoDatiEventoModelToApiTipoDatiEvento = (
  tipoDatiEvento: TipoDatiEventoModel
): TipoDatiEvento => ({
  eventDate: tipoDatiEvento?.dataEvento,
  noDay: tipoDatiEvento?.senzaGiorno,
  noMonth: tipoDatiEvento?.senzaGiorno,
  eventPlace: tipoDatiEvento?.luogoEvento,
  eventAct: tipoDatiEvento?.attoEvento,
});

export const TipoDatiSoggettiEnteModelToApiTipoDatiSoggettiEnte = (
  tipoDatiSoggettiEnteModel: TipoDatiSoggettiEnteModel
): TipoDatiSoggettiEnte => ({
  generality: tipoDatiSoggettiEnteModel?.generalita,
  address: tipoDatiSoggettiEnteModel?.residenza,
  identifiers: tipoDatiSoggettiEnteModel?.identificativi,
  deathDate: tipoDatiSoggettiEnteModel?.datiDecesso,
});

export const TipoListaSoggettiModelToApiTipoListaSoggetti = (
  tipoListaSoggettiModel: TipoListaSoggettiModel
): TipoListaSoggetti => ({
  subject: tipoListaSoggettiModel?.soggetto,
});

export const TipoErroriAnomaliaModelToApiTipoErroriAnomalia = (
  tipoErroriAnomaliaModel: TipoErroriAnomaliaModel
): TipoErroriAnomalia => ({
  warningErrorCode: tipoErroriAnomaliaModel?.campoErroreAnomalia,
  warningErrorType: tipoErroriAnomaliaModel?.tipoErroreAnomalia,
  warningErrorText: tipoErroriAnomaliaModel?.testoErroreAnomalia,
  warningErrorObject: tipoErroriAnomaliaModel?.oggettoErroreAnomalia,
  warningErrorField: tipoErroriAnomaliaModel?.campoErroreAnomalia,
  warningErrorValue: tipoErroriAnomaliaModel?.valoreErroreAnomalia,
});

/** *************************************** */

export const codiceFiscaleToApiTipoCodiceFiscale = (
  codiceFiscale: string
): TipoCodiceFiscale => ({
  fiscalCode: codiceFiscale,
  fiscalCodeValidity: "",
  dataAttributionValidity: "",
});

export const TipoDataNascitaModelToApiTipoLuogoEvento = (
  tipoDataNascitaModel: TipoDataNascitaModel
): TipoLuogoEvento => ({
  exceptionalPlace: tipoDataNascitaModel.birthPlace.exceptionalPlace,
  municipality: tipoComuneModelToApiTipoComune(
    tipoDataNascitaModel.birthPlace.municipality
  ),
  place: tipoLocalitaModelToApiTipoLocalita(
    tipoDataNascitaModel.birthPlace.place
  ),
});

export const SoggettoModelToApiTipoGeneralita = (
  soggettoModel: SoggettoModel
): TipoGeneralita => ({
  fiscalCode: codiceFiscaleToApiTipoCodiceFiscale(
    soggettoModel.fiscalCode
  ),
  surname: soggettoModel.surname,
  noSurname: soggettoModel.surname == null ? "true" : "false",
  name: soggettoModel.name,
  noName: soggettoModel.name == null ? "true" : "false",
  gender: soggettoModel.gender,
  birthDate: soggettoModel?.birthDate.eventDate,
  noDay: "",
  noMonth: "",
  birthPlace: TipoDataNascitaModelToApiTipoLuogoEvento(
    soggettoModel.birthDate
  ),
  AIRESubject: "",
  yearExpatriation: "",
  // idCommonSubjectData: TipoIdSchedaSoggettoComuneModelToApiTipoIdSchedaSoggettoComune()),
  idSubjectData: "",
  note: "",
});

export const TipoIndirizzoModelToApiTipoIndirizzo = (
  tipoIndirizzoModel: TipoIndirizzoModel
): TipoIndirizzo => ({
  cap: tipoIndirizzoModel?.cap,
  municipality: tipoComuneModelToApiTipoComune(tipoIndirizzoModel.municipality),
  fraction: tipoIndirizzoModel?.fraction,
  toponym: tipoToponimoModelToApiTipoToponimo(tipoIndirizzoModel.toponym),
  civicNumber: tipoNumeroCivicoModelToApiTipoNumeroCivico(
    tipoIndirizzoModel.civicNumber
  ),
});

export const TipoResidenzaModelToApiTipoResidenza = (
  tipoResidenzaModel: TipoResidenzaModel
): TipoResidenza[] => [
  {
    addressType: tipoResidenzaModel?.addressType,
    noteaddress: tipoResidenzaModel?.noteaddress,
    address: TipoIndirizzoModelToApiTipoIndirizzo(
      tipoResidenzaModel?.address
    ),
    foreignState: tipoLocalitaEsteraModelToApiTipoLocalitaEstera1(
      tipoResidenzaModel.foreignState
    ),
    presso: tipoResidenzaModel?.presso,
    addressStartDate: tipoResidenzaModel?.addressStartDate,
  },
];

export const UserModelToApiTipoDatiSoggettiEnte = (
  userModel: UserModel
): TipoDatiSoggettiEnte => ({
  generality: SoggettoModelToApiTipoGeneralita(userModel.subject),
  address: TipoResidenzaModelToApiTipoResidenza(userModel.address),
  // identificativi: TipoIdentificativi,
  // datiDecesso: TipoDatiEvento,
});

export const ProblemErrorModelToApiProblemError = (
  problemErrorModel: ProblemErrorModel
): ProblemError => ({
  code: problemErrorModel?.code || "",
  detail: problemErrorModel?.detail || "",
});

export const ProblemModelToApiProblem = (
  problemModel: ProblemModel,
  problemError: ProblemError[]
): Problem => ({
  type: problemModel?.type,
  status: problemModel?.status,
  title: problemModel?.title,
  correlationId: problemModel?.correlationId,
  detail: problemModel?.detail,
  errors: problemError,
});
