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
  ProblemErrorModel,
  ProblemModel,
} from "pdnd-models";

import {
  TipoIndirizzoEstero,
  TipoLocalitaEstera1,
  TipoResidenza,
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
} from "../modelAr001.js";
import {
  TipoLocalita,
  TipoComune,
  TipoLuogoNascitaE000,
  TipoToponimo,
  TipoCivicoInterno,
  TipoNumeroCivico,
  TipoIndirizzo,
  TipoDatoLocalitaEstera,
  TipoToponimoEstero,
  TipoConsolato,
  TipoDatiNascitaE000,
  TipoErroriAnomalia,
  ProblemError,
  Problem,
} from "./models.js";

export const apiTipoComuneToTipoComuneModel = (
  tipoComune: TipoComune | undefined
): TipoComuneModel => ({
  nameMunicipality: tipoComune?.nameMunicipality ?? "",
  istatCode: tipoComune?.istatCode ?? "",
  acronymIstatProvince: tipoComune?.acronymIstatProvince ?? "",
  placeDescription: tipoComune?.placeDescription ?? "",
});

export const apiTipoLocalitaToTipoLocalita = (
  tipoLocalita: TipoLocalita | undefined
): TipoLocalitaModel => ({
  placeDescription: tipoLocalita?.placeDescription ?? "",
  countryDescription: tipoLocalita?.countryDescription ?? "",
  codState: tipoLocalita?.codState ?? "",
  provinceCounty: tipoLocalita?.provinceCounty ?? "",
});

export const apiTipoLuogoNascitaToTipoLuogoNascitaModel = (
  tipoLuogoNascitaE000: TipoLuogoNascitaE000 | undefined
): TipoLuogoNascitaModel => ({
  exceptionalPlace: tipoLuogoNascitaE000?.exceptionalPlace ?? "",
  municipality: apiTipoComuneToTipoComuneModel(
    tipoLuogoNascitaE000?.municipality
  ),
  place: apiTipoLocalitaToTipoLocalita(tipoLuogoNascitaE000?.place),
});

export const apiTipoToponimoToTipoToponimoModel = (
  tipoToponimo: TipoToponimo | undefined
): TipoToponimoModel => ({
  codType: tipoToponimo?.codType ?? "",
  type: tipoToponimo?.type ?? "",
  originType: tipoToponimo?.originType ?? "",
  toponymCod: tipoToponimo?.toponymCod ?? "",
  toponymDenomination: tipoToponimo?.toponymDenomination ?? "",
  toponymSource: tipoToponimo?.toponymSource ?? "",
});

export const apiTipoCivicoInternoToTipoCivicoInternoModel = (
  tipoCivicoInterno: TipoCivicoInterno | undefined
): TipoCivicoInternoModel => ({
  court: tipoCivicoInterno?.court ?? "",
  stairs: tipoCivicoInterno?.stairs ?? "",
  internal1: tipoCivicoInterno?.internal1 ?? "",
  espInternal1: tipoCivicoInterno?.espInternal1 ?? "",
  internal2: tipoCivicoInterno?.internal2 ?? "",
  espInternal2: tipoCivicoInterno?.espInternal2 ?? "",
  externalStairs: tipoCivicoInterno?.externalStairs ?? "",
  secondary: tipoCivicoInterno?.secondary ?? "",
  floor: tipoCivicoInterno?.floor ?? "",
  nui: tipoCivicoInterno?.nui ?? "",
  isolated: tipoCivicoInterno?.isolated ?? "",
});

export const apiTipoNumeroCivicoToTipoNumeroCivicoModel = (
  tipoNumeroCivicoModel: TipoNumeroCivico | undefined
): TipoNumeroCivicoModel => ({
  civicCod: tipoNumeroCivicoModel?.civicCod ?? "",
  civicSource: tipoNumeroCivicoModel?.civicSource ?? "",
  civicNumber: tipoNumeroCivicoModel?.civicNumber ?? "",
  metric: tipoNumeroCivicoModel?.metric ?? "",
  progSNC: tipoNumeroCivicoModel?.progSNC ?? "",
  letter: tipoNumeroCivicoModel?.letter ?? "",
  exponent1: tipoNumeroCivicoModel?.exponent1 ?? "",
  color: tipoNumeroCivicoModel?.color ?? "",
  internalCivic: apiTipoCivicoInternoToTipoCivicoInternoModel(
    tipoNumeroCivicoModel?.internalCivic
  ),
});

export const apiTipoIndirizzoToTipoIndirizzoModel = (
  tipoIndirizzo: TipoIndirizzo | undefined
): TipoIndirizzoModel => ({
  cap: tipoIndirizzo?.cap ?? "",
  municipality: apiTipoComuneToTipoComuneModel(tipoIndirizzo?.municipality),
  fraction: tipoIndirizzo?.fraction ?? "",
  toponym: apiTipoToponimoToTipoToponimoModel(tipoIndirizzo?.toponym),
  civicNumber: apiTipoNumeroCivicoToTipoNumeroCivicoModel(
    tipoIndirizzo?.civicNumber
  ),
});

export const apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel = (
  tipoDatoLocalitaEstera: TipoDatoLocalitaEstera | undefined
): TipoDatoLocalitaEsteraModel => ({
  placeDescription: tipoDatoLocalitaEstera?.placeDescription ?? "",
  countryDescription: tipoDatoLocalitaEstera?.countryDescription ?? "",
  provinceCounty: tipoDatoLocalitaEstera?.provinceCounty ?? "",
  countryState: tipoDatoLocalitaEstera?.countryState ?? "",
});

export const apiTipoToponimoEsteroToTipoToponimoEsteroModel = (
  tipoToponimoEstero: TipoToponimoEstero | undefined
): TipoToponimoEsteroModel => ({
  denomination: tipoToponimoEstero?.denomination ?? "",
  civicNumber: tipoToponimoEstero?.civicNumber ?? "",
});

export const apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel = (
  tipoIndirizzoEstero: TipoIndirizzoEstero | undefined
): TipoIndirizzoEsteroModel => ({
  cap: tipoIndirizzoEstero?.cap ?? "",
  place: apiTipoDatoLocalitaEsteraToTipoDatoLocalitaEsteraModel(
    tipoIndirizzoEstero?.place as TipoDatoLocalitaEstera
  ),
  toponym: apiTipoToponimoEsteroToTipoToponimoEsteroModel(
    tipoIndirizzoEstero?.toponym as TipoToponimoEstero
  ),
});

export const apiTipoConsolatoToTipoConsolatoModel = (
  tipoConsolato: TipoConsolato | undefined
): TipoConsolatoModel => ({
  consulateCod: tipoConsolato?.consulateCod ?? "",
  consulateDescription: tipoConsolato?.consulateDescription ?? "",
});

export const apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel = (
  tipoLocalitaEstera: TipoLocalitaEstera1 | undefined
): TipoLocalitaEsteraModel => ({
  foreignAddress: apiTipoIndirizzoEsteroToTipoIndirizzoEsteroModel(
    tipoLocalitaEstera?.foreignAddress
  ),
  consulate: apiTipoConsolatoToTipoConsolatoModel(
    tipoLocalitaEstera?.consulate as TipoConsolato
  ),
});

export const apiTipoResidenzaToTipoResidenzaModel = (
  tipoResidenza: TipoResidenza | undefined
): TipoResidenzaModel => ({
  addressType: tipoResidenza?.addressType ?? "",
  noteaddress: tipoResidenza?.noteaddress ?? "",
  address: apiTipoIndirizzoToTipoIndirizzoModel(
    tipoResidenza?.address as TipoIndirizzo
  ),
  foreignState: apiTipoLocalitaEstera1ToTipoLocalitaEsteraModel(
    tipoResidenza?.foreignState
  ),
  presso: tipoResidenza?.presso ?? "",
  addressStartDate: tipoResidenza?.addressStartDate ?? "",
});

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
  municipality: tipoComuneModelToApiTipoComune(
    tipoLuogoNascitaModel?.municipality
  ),
  place: tipoLocalitaModelToApiTipoLocalita(tipoLuogoNascitaModel?.place),
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
  civicNumber: tipoNumeroCivicoModel?.civicNumber,
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
  municipality: tipoComuneModelToApiTipoComune(
    tipoIndirizzoModel?.municipality
  ),
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
  address: tipoIndirizzoModelToApiTipoIndirizzo(tipoResidenzaModel?.address),
  foreignState: tipoLocalitaEsteraModelToApiTipoLocalitaEstera1(
    tipoResidenzaModel?.foreignState
  ),
  presso: tipoResidenzaModel?.presso,
  addressStartDate: tipoResidenzaModel?.addressStartDate,
});

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
  subjectId: tipoParametriRicercaModel?.soggettoId,
  id: tipoParametriRicercaModel?.id,
  surname: tipoParametriRicercaModel?.cognome,
  noSurname: tipoParametriRicercaModel?.senzaCognome,
  name: tipoParametriRicercaModel?.nome,
  noName: tipoParametriRicercaModel?.senzaNome,
  gender: tipoParametriRicercaModel?.sesso,
  birthDate: tipoParametriRicercaModel?.datiNascita as TipoDatiNascitaE000,
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
  subjectId: tipoCodiceFiscaleModel?.soggettoId,
  subjectIdValidity: tipoCodiceFiscaleModel?.validitaSoggettoId,
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
  idCommonSubjectDataIstat: tipoLuogoEventoModel?.idSchedaSoggettoComuneIstat,
  idSubjectData: tipoLuogoEventoModel?.idSchedaSoggetto,
});

export const TipoGeneralitaModelToApiTipoGeneralita = (
  tipoGeneralitaModel: TipoGeneralitaModel
): TipoGeneralita => ({
  subjectId: tipoGeneralitaModel?.soggettoId as TipoCodiceFiscale,
  surname: tipoGeneralitaModel?.cognome,
  noSurname: tipoGeneralitaModel?.senzaCognome,
  name: tipoGeneralitaModel?.nome,
  noName: tipoGeneralitaModel?.senzaNome,
  gender: tipoGeneralitaModel?.sesso,
  birthDate: tipoGeneralitaModel?.dataNascita,
  noDay: tipoGeneralitaModel?.senzaGiorno,
  noMonth: tipoGeneralitaModel?.senzaGiornoMese,
  birthPlace: tipoGeneralitaModel?.luogoNascita as TipoLuogoEvento,
  AIRESubject: tipoGeneralitaModel?.soggettoAIRE,
  yearExpatriation: tipoGeneralitaModel?.annoEspatrio,
  idCommonSubjectData:
    tipoGeneralitaModel?.idSchedaSoggettoComune as TipoIdSchedaSoggettoComune,
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
  eventPlace: tipoDatiEvento?.luogoEvento as TipoLuogoEvento,
  eventAct: tipoDatiEvento?.attoEvento as TipoAttoEvento,
});

export const TipoDatiSoggettiEnteModelToApiTipoDatiSoggettiEnte = (
  tipoDatiSoggettiEnteModel: TipoDatiSoggettiEnteModel
): TipoDatiSoggettiEnte => ({
  generality: tipoDatiSoggettiEnteModel?.generalita,
  address: tipoDatiSoggettiEnteModel?.residenza,
  identifiers: tipoDatiSoggettiEnteModel?.identificativi,
  deathDate: tipoDatiSoggettiEnteModel?.datiDecesso as TipoDatiEvento,
});

export const TipoListaSoggettiModelToApiTipoListaSoggetti = (
  tipoListaSoggettiModel: TipoListaSoggettiModel
): TipoListaSoggetti => ({
  subject: tipoListaSoggettiModel?.soggetto as TipoDatiSoggettiEnte[],
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

export const codiceFiscaleToApiTipoCodiceFiscale = (
  soggettoId: string
): TipoCodiceFiscale => ({
  subjectId: soggettoId,
  subjectIdValidity: "",
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
  subjectId: codiceFiscaleToApiTipoCodiceFiscale(soggettoModel.subjectId),
  surname: soggettoModel.surname,
  noSurname: soggettoModel.surname == null ? "true" : "false",
  name: soggettoModel.name,
  noName: soggettoModel.name == null ? "true" : "false",
  gender: soggettoModel.gender,
  birthDate: soggettoModel?.birthDate.eventDate,
  noDay: "",
  noMonth: "",
  birthPlace: TipoDataNascitaModelToApiTipoLuogoEvento(soggettoModel.birthDate),
  AIRESubject: "",
  yearExpatriation: "",
  idSubjectData: "",
  note: "",
});

export const TipoIndirizzoModelToApiTipoIndirizzo = (
  tipoIndirizzoModel: TipoIndirizzoModel
): TipoIndirizzo => ({
  cap: tipoIndirizzoModel.cap,
  municipality: tipoComuneModelToApiTipoComune(tipoIndirizzoModel.municipality),
  fraction: tipoIndirizzoModel.fraction,
  toponym: tipoToponimoModelToApiTipoToponimo(tipoIndirizzoModel.toponym),
  civicNumber: tipoNumeroCivicoModelToApiTipoNumeroCivico(
    tipoIndirizzoModel.civicNumber
  ),
  coords: tipoIndirizzoModel.coords
    ? {
        latitude: tipoIndirizzoModel.coords.latitude,
        longitude: tipoIndirizzoModel.coords.longitude,
      }
    : undefined,
});

export const TipoResidenzaModelToApiTipoResidenza = (
  tipoResidenzaModel: TipoResidenzaModel
): TipoResidenza[] => [
  {
    addressType: tipoResidenzaModel?.addressType,
    noteaddress: tipoResidenzaModel?.noteaddress,
    address: TipoIndirizzoModelToApiTipoIndirizzo(tipoResidenzaModel?.address),
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
});

export const ProblemErrorModelToApiProblemError = (
  problemErrorModel: ProblemErrorModel
): ProblemError => ({
  code: problemErrorModel?.code ?? "",
  detail: problemErrorModel?.detail ?? "",
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
