import { Mapping } from "pdnd-common";

export const REQ_AR003_ITA_TO_ENG: Mapping = {
  idOperazioneClient: "operationId",

  "soggetto.codiceFiscale": "subjects.subject.generality.subjectId.subjectId",
  "soggetto.idANPR": "subjects.subject.generality.idSubjectData",
  "soggetto.cognome": "subjects.subject.generality.surname",
  "soggetto.senzaCognome": "subjects.subject.generality.noSurname",
  "soggetto.nome": "subjects.subject.generality.name",
  "soggetto.senzaNome": "subjects.subject.generality.noName",
  "soggetto.sesso": "subjects.subject.generality.gender",

  "soggetto.datiNascita.dataEvento":
    "subjects.subject.generality.birthDate.eventDate",
  "soggetto.datiNascita.senzaGiorno":
    "subjects.subject.generality.birthDate.noDay",
  "soggetto.datiNascita.senzaGiornoMese":
    "subjects.subject.generality.birthDate.noMonth",

  "soggetto.datiNascita.luogoNascita.luogoEccezionale":
    "subjects.subject.generality.birthDate.birthPlace.exceptionalPlace",
  "soggetto.datiNascita.luogoNascita.comune.nomeComune":
    "subjects.subject.generality.birthDate.birthPlace.municipality.nameMunicipality",
  "soggetto.datiNascita.luogoNascita.comune.codiceIstat":
    "subjects.subject.generality.birthDate.birthPlace.municipality.istatCode",
  "soggetto.datiNascita.luogoNascita.comune.siglaProvinciaIstat":
    "subjects.subject.generality.birthDate.birthPlace.municipality.acronymIstatProvince",
  "soggetto.datiNascita.luogoNascita.comune.descrizioneLocalita":
    "subjects.subject.generality.birthDate.birthPlace.municipality.placeDescription",

  "soggetto.datiNascita.luogoNascita.localita.descrizioneLocalita":
    "subjects.subject.generality.birthDate.birthPlace.place.placeDescription",
  "soggetto.datiNascita.luogoNascita.localita.descrizioneStato":
    "subjects.subject.generality.birthDate.birthPlace.place.countryDescription",
  "soggetto.datiNascita.luogoNascita.localita.codiceStato":
    "subjects.subject.generality.birthDate.birthPlace.place.codState",
  "soggetto.datiNascita.luogoNascita.localita.provinciaContea":
    "subjects.subject.generality.birthDate.birthPlace.place.provinceCounty",

  "soggetto.residenza.tipoIndirizzo": "subjects.subject.address.addressType",

  "soggetto.residenza.indirizzo.cap": "subjects.subject.address.address.cap",
  "soggetto.residenza.indirizzo.comune.nomeComune":
    "subjects.subject.address.address.municipality.nameMunicipality",
  "soggetto.residenza.indirizzo.comune.codiceIstat":
    "subjects.subject.address.address.municipality.istatCode",
  "soggetto.residenza.indirizzo.comune.siglaProvinciaIstat":
    "subjects.subject.address.address.municipality.acronymIstatProvince",
  "soggetto.residenza.indirizzo.comune.descrizioneLocalita":
    "subjects.subject.address.address.municipality.placeDescription",
  "soggetto.residenza.indirizzo.frazione":
    "subjects.subject.address.address.fraction",

  "soggetto.residenza.indirizzo.toponimo.codSpecie":
    "subjects.subject.address.address.toponym.codType",
  "soggetto.residenza.indirizzo.toponimo.specie":
    "subjects.subject.address.address.toponym.type",
  "soggetto.residenza.indirizzo.toponimo.specieFonte":
    "subjects.subject.address.address.toponym.originType",
  "soggetto.residenza.indirizzo.toponimo.codToponimo":
    "subjects.subject.address.address.toponym.toponymCod",
  "soggetto.residenza.indirizzo.toponimo.denominazioneToponimo":
    "subjects.subject.address.address.toponym.toponymDenomination",
  "soggetto.residenza.indirizzo.toponimo.toponimoFonte":
    "subjects.subject.address.address.toponym.toponymSource",

  "soggetto.residenza.indirizzo.numeroCivico.codiceCivico":
    "subjects.subject.address.address.civicNumber.civicCod",
  "soggetto.residenza.indirizzo.numeroCivico.civicoFonte":
    "subjects.subject.address.address.civicNumber.civicSource",
  "soggetto.residenza.indirizzo.numeroCivico.numero":
    "subjects.subject.address.address.civicNumber.civicNumber",
  "soggetto.residenza.indirizzo.numeroCivico.metrico":
    "subjects.subject.address.address.civicNumber.metric",
  "soggetto.residenza.indirizzo.numeroCivico.progSNC":
    "subjects.subject.address.address.civicNumber.progSNC",
  "soggetto.residenza.indirizzo.numeroCivico.lettera":
    "subjects.subject.address.address.civicNumber.letter",
  "soggetto.residenza.indirizzo.numeroCivico.esponente1":
    "subjects.subject.address.address.civicNumber.exponent1",
  "soggetto.residenza.indirizzo.numeroCivico.colore":
    "subjects.subject.address.address.civicNumber.color",

  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.corte":
    "subjects.subject.address.address.civicNumber.internalCivic.court",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.scala":
    "subjects.subject.address.address.civicNumber.internalCivic.stairs",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.interno1":
    "subjects.subject.address.address.civicNumber.internalCivic.internal1",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.espInterno1":
    "subjects.subject.address.address.civicNumber.internalCivic.espInternal1",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.interno2":
    "subjects.subject.address.address.civicNumber.internalCivic.internal2",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.espInterno2":
    "subjects.subject.address.address.civicNumber.internalCivic.espInternal2",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.scalaEsterna":
    "subjects.subject.address.address.civicNumber.internalCivic.externalStairs",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.secondario":
    "subjects.subject.address.address.civicNumber.internalCivic.secondary",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.piano":
    "subjects.subject.address.address.civicNumber.internalCivic.floor",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.nui":
    "subjects.subject.address.address.civicNumber.internalCivic.nui",
  "soggetto.residenza.indirizzo.numeroCivico.civicoInterno.isolato":
    "subjects.subject.address.address.civicNumber.internalCivic.isolated",

  "soggetto.residenza.localitaEstera.indirizzoEstero.cap":
    "subjects.subject.address.foreignState.foreignAddress.cap",
  "soggetto.residenza.localitaEstera.indirizzoEstero.localita.descrizioneLocalita":
    "subjects.subject.address.foreignState.foreignAddress.place.placeDescription",
  "soggetto.residenza.localitaEstera.indirizzoEstero.localita.descrizioneStato":
    "subjects.subject.address.foreignState.foreignAddress.place.countryDescription",
  "soggetto.residenza.localitaEstera.indirizzoEstero.localita.codiceStato":
    "subjects.subject.address.foreignState.foreignAddress.place.countryState",
  "soggetto.residenza.localitaEstera.indirizzoEstero.localita.provinciaContea":
    "subjects.subject.address.foreignState.foreignAddress.place.provinceCounty",
  "soggetto.residenza.localitaEstera.indirizzoEstero.toponimo.denominazione":
    "subjects.subject.address.foreignState.foreignAddress.toponym.denomination",
  "soggetto.residenza.localitaEstera.indirizzoEstero.toponimo.numeroCivico":
    "subjects.subject.address.foreignState.foreignAddress.toponym.civicNumber",

  "soggetto.residenza.localitaEstera.consolato.codiceConsolato":
    "subjects.subject.address.foreignState.consulate.consulateCod",
  "soggetto.residenza.localitaEstera.consolato.descrizioneConsolato":
    "subjects.subject.address.foreignState.consulate.consulateDescription",
};
