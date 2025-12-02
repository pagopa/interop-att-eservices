export interface RichiestaAR001 {
  operationId: string;
  criteria: TipoParametriRicercaAR001;
  requestData: TipoRichiestaAR001;
}

export interface RispostaAR001 {
  idOp?: string;
  subjects?: TipoListaSubjects;
  warnings?: TipoErroriAnomalia[];
}

export interface TipoParametriRicercaAR001 {
  subjectId?: string;
  id?: string;
  surname?: string;
  noSurname?: string;
  name?: string;
  noName?: string;
  gender?: string;
  birthDate?: TipoDatiNascitaE000;
}

export interface TipoRichiestaAR001 {
  dateOfRequest: string;
  motivation: string;
  useCase: string;
}

export interface TipoListaSubjects {
  subject?: TipoDatiSubjectsEnte[];
}

export interface TipoErroriAnomalia {
  warningErrorCode?: string;
  warningErrorType?: string;
  warningErrorText?: string;
  warningErrorObject?: string;
  warningErrorField?: string;
  warningErrorValue?: string;
}

export interface TipoDatiNascitaE000 {
  eventDate?: string;
  noDay?: string;
  noMonth?: string;
  birthPlace?: TipoLuogoNascitaE000;
}

export interface TipoLuogoNascitaE000 {
  exceptionalPlace?: string;
  municipality?: TipoComune;
  place?: TipoLocalita;
}

export interface TipoComune {
  nameMunicipality?: string;
  istatCode?: string;
  acronymIstatProvince?: string;
  placeDescription?: string;
}

export interface TipoLocalita {
  placeDescription?: string;
  countryDescription?: string;
  codState?: string;
  provinceCounty?: string;
}

export interface TipoDatiSubjectsEnte {
  generality?: TipoGeneralita;
  address?: TipoResidenza[];
  identifiers?: TipoIdentificativi;
  deathDate?: TipoDatiEvento;
}

export interface TipoGeneralita {
  subjectId?: TipoCodiceFiscale;
  surname?: string;
  noSurname?: string;
  name?: string;
  noName?: string;
  gender?: string;
  birthDate?: string;
  noDay?: string;
  noMonth?: string;
  birthPlace?: TipoLuogoEvento;
  AIRESubject?: string;
  yearExpatriation?: string;
  idCommonSubjectData?: TipoIdSchedaSoggettoComune;
  idSubjectData?: string;
  note?: string;
}

export interface TipoCodiceFiscale {
  subjectId?: string;
  subjectIdValidity?: string;
  dataAttributionValidity?: string;
}

export interface TipoLuogoEvento {
  exceptionalPlace?: string;
  municipality?: TipoComune;
  place?: TipoLocalita;
}

export interface TipoIdSchedaSoggettoComune {
  idCommonSubjectDataIstat?: string;
  idSubjectData?: string;
}

export interface TipoResidenza {
  addressType?: string;
  noteaddress?: string;
  address?: TipoIndirizzo;
  foreignState?: TipoLocalitaEstera1;
  presso?: string;
  addressStartDate?: string;
}

export interface TipoIndirizzo {
  cap?: string;
  municipality?: TipoComune;
  fraction?: string;
  toponym?: TipoToponimo;
  civicNumber?: TipoNumeroCivico;
}

export interface TipoLocalitaEstera1 {
  foreignAddress?: TipoIndirizzoEstero;
  consulate?: TipoConsolato;
}

export interface TipoToponimo {
  codType?: string;
  type?: string;
  originType?: string;
  toponymCod?: string;
  toponymDenomination?: string;
  toponymSource?: string;
}

export interface TipoNumeroCivico {
  civicCod?: string;
  civicSource?: string;
  civicNumber?: string;
  metric?: string;
  progSNC?: string;
  letter?: string;
  exponent1?: string;
  color?: string;
  internalCivic?: TipoCivicoInterno;
}

export interface TipoCivicoInterno {
  court?: string;
  stairs?: string;
  internal1?: string;
  espInternal1?: string;
  internal2?: string;
  espInternal2?: string;
  externalStairs?: string;
  secondary?: string;
  floor?: string;
  nui?: string;
  isolated?: string;
}

export interface TipoIndirizzoEstero {
  cap?: string;
  place?: TipoDatoLocalitaEstera;
  toponym?: TipoToponimoEstero;
}

export interface TipoConsolato {
  consulateCod?: string;
  consulateDescription?: string;
}

export interface TipoDatoLocalitaEstera {
  placeDescription?: string;
  countryDescription?: string;
  countryState?: string;
  provinceCounty?: string;
}

export interface TipoToponimoEstero {
  denomination?: string;
  civicNumber?: string;
}

export interface TipoIdentificativi {
  id?: string;
}

export interface TipoDatiEvento {
  eventDate?: string;
  noDay?: string;
  noMonth?: string;
  eventPlace?: TipoLuogoEvento;
  eventAct?: TipoAttoEvento;
}

export interface TipoAttoEvento {
  act?: TipoAtto;
  actANSC?: TipoAttoANSC;
}

export interface TipoAttoANSC {
  idANSC?: string;
  municipalityRegistration?: TipoComune;
  act?: string;
  municipalOffice?: string;
  municipalNumber?: string;
  dateFormationAct?: string;
  transcribed?: string;
}

export interface TipoAtto {
  municipalityRegistration?: TipoComune;
  municipalOffice?: string;
  year?: string;
  part?: string;
  series?: string;
  actNumber?: string;
  volume?: string;
  dateFormationAct?: string;
  transcribed?: string;
}

export interface TipoDatiSoggettiEnte {
  generality?: TipoGeneralita;
  address?: TipoResidenza[];
  identifiers?: TipoIdentificativi;
  deathDate?: TipoDatiEvento;
}

export interface TipoListaSoggetti {
  subject?: TipoDatiSoggettiEnte[];
}
