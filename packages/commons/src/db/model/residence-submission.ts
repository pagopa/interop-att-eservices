export interface DbAddress {
  id?: string;
  address_type?: string;
  note_address?: string;
  address_start_date?: string;
  presso?: string;
  address_municipality_name?: string;
  address_municipality_istat_code?: string;
  address_municipality_acronym_istat_province?: string;
  address_municipality_place_description?: string;
  toponym_cod_type?: string;
  toponym_type?: string;
  toponym_origin_type?: string;
  toponym_cod?: string;
  toponym_denomination?: string;
  toponym_source?: string;
  civic_cod?: string;
  civic_source?: string;
  civic_number?: string;
  metric?: string;
  prog_snc?: string;
  letter?: string;
  exponent1?: string;
  color?: string;
  internal_court?: string;
  internal_stairs?: string;
  internal1?: string;
  esp_internal1?: string;
  internal2?: string;
  esp_internal2?: string;
  external_stairs?: string;
  secondary?: string;
  floor?: string;
  nui?: string;
  isolated?: string;
  latitude?: string;
  longitude?: string;
  foreign_cap?: string;
  foreign_place_description?: string;
  foreign_country_description?: string;
  foreign_country_state?: string;
  foreign_province_county?: string;
  foreign_toponym_denomination?: string;
  foreign_toponym_civic_number?: string;
  consulate_cod?: string;
  consulate_description?: string;
  subject_id?: string;
}

export interface DbSubject {
  uuid?: string;
  id?: string;
  subject_id?: string;
  surname?: string;
  name?: string;
  gender?: string;
  birth_event_date?: string;
  birth_exceptional_place?: string;
  birth_municipality_name?: string;
  birth_municipality_istat_code?: string;
  birth_municipality_acronym_istat_province?: string;
  birth_municipality_place_description?: string;
  birth_place_description?: string;
  birth_country_description?: string;
  birth_cod_state?: string;
  birth_province_county?: string;
}

export interface MappedDbData {
  subject?: DbSubject;
  addresses?: DbAddress[];
}

export type DebugSchema = DbAddress | DbSubject | MappedDbData;

export interface TipoCodiceFiscale {
  subjectId?: string;
  subjectIdValidity?: string;
  dataAttributionValidity?: string;
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

export interface TipoLuogoEvento {
  exceptionalPlace?: string;
  municipality?: TipoComune;
  place?: TipoLocalita;
}

export interface TipoIdSchedaSoggettoComune {
  idCommonSubjectDataIstat?: string;
  idSubjectData?: string;
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

export interface TipoToponimo {
  codType?: string;
  type?: string;
  originType?: string;
  toponymCod?: string;
  toponymDenomination?: string;
  toponymSource?: string;
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

export interface TipoIndirizzo {
  cap?: string;
  municipality?: TipoComune;
  fraction?: string;
  toponym?: TipoToponimo;
  civicNumber?: TipoNumeroCivico;
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

export interface TipoIndirizzoEstero {
  cap?: string;
  place?: TipoDatoLocalitaEstera;
  toponym?: TipoToponimoEstero;
}

export interface TipoConsolato {
  consulateCod?: string;
  consulateDescription?: string;
}

export interface TipoLocalitaEstera1 {
  foreignAddress?: TipoIndirizzoEstero;
  consulate?: TipoConsolato;
}

export interface TipoResidenza {
  addressType?: string;
  noteaddress?: string;
  address?: TipoIndirizzo;
  foreignState?: TipoLocalitaEstera1;
  presso?: string;
  addressStartDate?: string;
}

export interface TipoIdentificativi {
  id?: string;
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

export interface TipoAttoANSC {
  idANSC?: string;
  municipalityRegistration?: TipoComune;
  act?: string;
  municipalOffice?: string;
  municipalNumber?: string;
  dateFormationAct?: string;
  transcribed?: string;
}

export interface TipoAttoEvento {
  act?: TipoAtto;
  actANSC?: TipoAttoANSC;
}

export interface TipoDatiEvento {
  eventDate?: string;
  noDay?: string;
  noMonth?: string;
  eventPlace?: TipoLuogoEvento;
  eventAct?: TipoAttoEvento;
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

export interface RichiestaAR003 {
  idOp?: string;
  subjects?: TipoListaSoggetti;
}
