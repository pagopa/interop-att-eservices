import { Mapping } from "pdnd-common";

export const REQ_ITA_TO_ENG: Mapping = {
  idOperazioneClient: "operationId",

  "criteriRicerca.codiceFiscale": "criteria.subjectId",
  "criteriRicerca.idANPR": "criteria.id",
  "criteriRicerca.cognome": "criteria.surname",
  "criteriRicerca.senzaCognome": "criteria.noSurname",
  "criteriRicerca.nome": "criteria.name",
  "criteriRicerca.senzaNome": "criteria.noName",
  "criteriRicerca.sesso": "criteria.gender",

  "criteriRicerca.datiNascita.dataEvento": "criteria.birthDate.eventDate",
  "criteriRicerca.datiNascita.senzaGiorno": "criteria.birthDate.noDay",
  "criteriRicerca.datiNascita.senzaGiornoMese": "criteria.birthDate.noMonth",

  "criteriRicerca.datiNascita.luogoNascita.luogoEccezionale":
    "criteria.birthDate.birthPlace.exceptionalPlace",
  "criteriRicerca.datiNascita.luogoNascita.comune.nomeComune":
    "criteria.birthDate.birthPlace.municipality.nameMunicipality",
  "criteriRicerca.datiNascita.luogoNascita.comune.codiceIstat":
    "criteria.birthDate.birthPlace.municipality.istatCode",
  "criteriRicerca.datiNascita.luogoNascita.comune.siglaProvinciaIstat":
    "criteria.birthDate.birthPlace.municipality.acronymIstatProvince",
  "criteriRicerca.datiNascita.luogoNascita.comune.descrizioneLocalita":
    "criteria.birthDate.birthPlace.municipality.placeDescription",

  "criteriRicerca.datiNascita.luogoNascita.localita.descrizioneLocalita":
    "criteria.birthDate.birthPlace.place.placeDescription",
  "criteriRicerca.datiNascita.luogoNascita.localita.descrizioneStato":
    "criteria.birthDate.birthPlace.place.countryDescription",
  "criteriRicerca.datiNascita.luogoNascita.localita.codiceStato":
    "criteria.birthDate.birthPlace.place.codState",
  "criteriRicerca.datiNascita.luogoNascita.localita.provinciaContea":
    "criteria.birthDate.birthPlace.place.provinceCounty",

  "verifica.residenza.tipoIndirizzo": "check.address.addressType",
  "verifica.residenza.indirizzo.cap": "check.address.address.cap",
  "verifica.residenza.indirizzo.comune.nomeComune":
    "check.address.address.municipality.nameMunicipality",
  "verifica.residenza.indirizzo.comune.codiceIstat":
    "check.address.address.municipality.istatCode",
  "verifica.residenza.indirizzo.comune.siglaProvinciaIstat":
    "check.address.address.municipality.acronymIstatProvince",
  "verifica.residenza.indirizzo.comune.descrizioneLocalita":
    "check.address.address.municipality.placeDescription",
  "verifica.residenza.indirizzo.frazione": "check.address.address.fraction",

  "verifica.residenza.indirizzo.toponimo.codSpecie":
    "check.address.address.toponym.codType",
  "verifica.residenza.indirizzo.toponimo.specie":
    "check.address.address.toponym.type",
  "verifica.residenza.indirizzo.toponimo.specieFonte":
    "check.address.address.toponym.originType",
  "verifica.residenza.indirizzo.toponimo.codToponimo":
    "check.address.address.toponym.toponymCod",
  "verifica.residenza.indirizzo.toponimo.denominazioneToponimo":
    "check.address.address.toponym.toponymDenomination",
  "verifica.residenza.indirizzo.toponimo.toponimoFonte":
    "check.address.address.toponym.toponymSource",

  "verifica.residenza.indirizzo.numeroCivico.codiceCivico":
    "check.address.address.civicNumber.civicCod",
  "verifica.residenza.indirizzo.numeroCivico.civicoFonte":
    "check.address.address.civicNumber.civicSource",
  "verifica.residenza.indirizzo.numeroCivico.numero":
    "check.address.address.civicNumber.civicNumber",
  "verifica.residenza.indirizzo.numeroCivico.metrico":
    "check.address.address.civicNumber.metric",
  "verifica.residenza.indirizzo.numeroCivico.progSNC":
    "check.address.address.civicNumber.progSNC",
  "verifica.residenza.indirizzo.numeroCivico.lettera":
    "check.address.address.civicNumber.letter",
  "verifica.residenza.indirizzo.numeroCivico.esponente1":
    "check.address.address.civicNumber.exponent1",
  "verifica.residenza.indirizzo.numeroCivico.colore":
    "check.address.address.civicNumber.color",

  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.corte":
    "check.address.address.civicNumber.internalCivic.court",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.scala":
    "check.address.address.civicNumber.internalCivic.stairs",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.interno1":
    "check.address.address.civicNumber.internalCivic.internal1",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.espInterno1":
    "check.address.address.civicNumber.internalCivic.espInternal1",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.interno2":
    "check.address.address.civicNumber.internalCivic.internal2",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.espInterno2":
    "check.address.address.civicNumber.internalCivic.espInternal2",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.scalaEsterna":
    "check.address.address.civicNumber.internalCivic.externalStairs",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.secondario":
    "check.address.address.civicNumber.internalCivic.secondary",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.piano":
    "check.address.address.civicNumber.internalCivic.floor",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.nui":
    "check.address.address.civicNumber.internalCivic.nui",
  "verifica.residenza.indirizzo.numeroCivico.civicoInterno.isolato":
    "check.address.address.civicNumber.internalCivic.isolated",

  "verifica.residenza.localitaEstera.indirizzoEstero.cap":
    "check.address.foreignState.foreignAddress.cap",
  "verifica.residenza.localitaEstera.indirizzoEstero.localita.descrizioneLocalita":
    "check.address.foreignState.foreignAddress.place.placeDescription",
  "verifica.residenza.localitaEstera.indirizzoEstero.localita.descrizioneStato":
    "check.address.foreignState.foreignAddress.place.countryDescription",
  "verifica.residenza.localitaEstera.indirizzoEstero.localita.codiceStato":
    "check.address.foreignState.foreignAddress.place.codState",
  "verifica.residenza.localitaEstera.indirizzoEstero.localita.provinciaContea":
    "check.address.foreignState.foreignAddress.place.provinceCounty",
  "verifica.residenza.localitaEstera.indirizzoEstero.toponimo.denominazione":
    "check.address.foreignState.foreignAddress.toponym.denomination",
  "verifica.residenza.localitaEstera.indirizzoEstero.toponimo.numeroCivico":
    "check.address.foreignState.foreignAddress.toponym.civicNumber",

  "verifica.residenza.localitaEstera.consolato.codiceConsolato":
    "check.address.foreignState.consulate.consulateCod",
  "verifica.residenza.localitaEstera.consolato.descrizioneConsolato":
    "check.address.foreignState.consulate.consulateDescription",

  "datiRichiesta.motivoRichiesta": "requestData.motivation",
  "datiRichiesta.casoUso": "requestData.useCase",
  "datiRichiesta.dataRiferimentoRichiesta": "requestData.dateOfRequest",
};

export const RES_ENG_TO_ITA_KEYS: Mapping = {
  "subject.surname": "cognome",
  "subject.name": "nome",
  "subject.subjectId": "codiceFiscale",
  "subject.gender": "sesso",
  "subject.birthDate.eventDate": "dataNascita",

  "address.addressType": "tipoIndirizzo",
  "address.address.cap": "cap",
  "address.address.municipality.nameMunicipality": "comune",
  "address.address.municipality.acronymIstatProvince": "provincia",
  "address.address.municipality.istatCode": "codiceIstat",

  "address.address.toponym.toponymDenomination": "indirizzo",
  "address.address.toponym.type": "specie",

  "address.address.civicNumber.civicNumber": "numeroCivico",
  "address.address.civicNumber.letter": "lettera",

  "address.address.civicNumber.internalCivic.stairs": "scala",
  "address.address.civicNumber.internalCivic.floor": "piano",
  "address.address.civicNumber.internalCivic.internal1": "interno",
};
