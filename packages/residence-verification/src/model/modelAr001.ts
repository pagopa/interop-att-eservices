import { z } from "zod";

export const TipoComune = z.object({
  nameMunicipality: z.string().optional(),
  istatCode: z.string().optional(),
  acronymIstatProvince: z.string().optional(),
  placeDescription: z.string().optional(),
});

export const TipoLocalita = z.object({
  placeDescription: z.string().optional(),
  countryDescription: z.string().optional(),
  codState: z.string().optional(),
  provinceCounty: z.string().optional(),
});

export const TipoLuogoNascitaE000 = z.object({
  exceptionalPlace: z.string().optional(),
  municipality: TipoComune.optional(),
  place: TipoLocalita.optional(),
});

export const TipoDatiNascitaE000 = z.object({
  eventDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  birthPlace: TipoLuogoNascitaE000.optional(),
});

export const TipoParametriRicercaAR001 = z.object({
  subjectId: z.string().optional(),
  id: z.string().optional(),
  surname: z.string().optional(),
  noSurname: z.string().optional(),
  name: z.string().optional(),
  noName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: TipoDatiNascitaE000.optional(),
});

export const TipoRichiestaAR001 = z.object({
  dateOfRequest: z.string(),
  motivation: z.string(),
  useCase: z.string(),
});

export const TipoErroriAnomalia = z.object({
  warningErrorCode: z.string().optional(),
  warningErrorType: z.string().optional(),
  warningErrorText: z.string().optional(),
  warningErrorObject: z.string().optional(),
  warningErrorField: z.string().optional(),
  warningErrorValue: z.string().optional(),
});

export const TipoCodiceFiscale = z.object({
  subjectId: z.string().optional(),
  subjectIdValidity: z.string().optional(),
  dataAttributionValidity: z.string().optional(),
});

export const TipoIdSchedaSoggettoComune = z.object({
  idCommonSubjectDataIstat: z.string().optional(),
  idSubjectData: z.string().optional(),
});

export const TipoLuogoEvento = z.object({
  exceptionalPlace: z.string().optional(),
  municipality: TipoComune.optional(),
  place: TipoLocalita.optional(),
});

export const TipoGeneralita = z.object({
  subjectId: TipoCodiceFiscale.optional(),
  surname: z.string().optional(),
  noSurname: z.string().optional(),
  name: z.string().optional(),
  noName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  birthPlace: TipoLuogoEvento.optional(),
  AIRESubject: z.string().optional(),
  yearExpatriation: z.string().optional(),
  idCommonSubjectData: TipoIdSchedaSoggettoComune.optional(),
  idSubjectData: z.string().optional(),
  note: z.string().optional(),
});

export const TipoToponimo = z.object({
  codType: z.string().optional(),
  type: z.string().optional(),
  originType: z.string().optional(),
  toponymCod: z.string().optional(),
  toponymDenomination: z.string().optional(),
  toponymSource: z.string().optional(),
});

export const TipoCivicoInterno = z.object({
  court: z.string().optional(),
  stairs: z.string().optional(),
  internal1: z.string().optional(),
  espInternal1: z.string().optional(),
  internal2: z.string().optional(),
  espInternal2: z.string().optional(),
  externalStairs: z.string().optional(),
  secondary: z.string().optional(),
  floor: z.string().optional(),
  nui: z.string().optional(),
  isolated: z.string().optional(),
});

export const TipoNumeroCivico = z.object({
  civicCod: z.string().optional(),
  civicSource: z.string().optional(),
  civicNumber: z.string().optional(),
  metric: z.string().optional(),
  progSNC: z.string().optional(),
  letter: z.string().optional(),
  exponent1: z.string().optional(),
  color: z.string().optional(),
  internalCivic: TipoCivicoInterno.optional(),
});

export const TipoIndirizzo = z.object({
  cap: z.string().optional(),
  municipality: TipoComune.optional(),
  fraction: z.string().optional(),
  toponym: TipoToponimo.optional(),
  civicNumber: TipoNumeroCivico.optional(),
  coords: z
    .object({
      latitude: z.string().optional(),
      longitude: z.string().optional(),
    })
    .optional(),
});

export const TipoConsolato = z.object({
  consulateCod: z.string().optional(),
  consulateDescription: z.string().optional(),
});

export const TipoDatoLocalitaEstera = z.object({
  placeDescription: z.string().optional(),
  countryDescription: z.string().optional(),
  countryState: z.string().optional(),
  provinceCounty: z.string().optional(),
});

export const TipoToponimoEstero = z.object({
  denomination: z.string().optional(),
  civicNumber: z.string().optional(),
});

export const TipoIndirizzoEstero = z.object({
  cap: z.string().optional(),
  place: TipoDatoLocalitaEstera.optional(),
  toponym: TipoToponimoEstero.optional(),
});

export const TipoLocalitaEstera1 = z.object({
  foreignAddress: TipoIndirizzoEstero.optional(),
  consulate: TipoConsolato.optional(),
});

export const TipoResidenza = z.object({
  addressType: z.string().optional(),
  noteaddress: z.string().optional(),
  address: TipoIndirizzo.optional(),
  foreignState: TipoLocalitaEstera1.optional(),
  presso: z.string().optional(),
  addressStartDate: z.string().optional(),
});

export const TipoIdentificativi = z.object({
  id: z.string().optional(),
});

export const TipoAtto = z.object({
  municipalityRegistration: TipoComune.optional(),
  municipalOffice: z.string().optional(),
  year: z.string().optional(),
  part: z.string().optional(),
  series: z.string().optional(),
  actNumber: z.string().optional(),
  volume: z.string().optional(),
  dateFormationAct: z.string().optional(),
  transcribed: z.string().optional(),
});

export const TipoAttoANSC = z.object({
  idANSC: z.string().optional(),
  municipalityRegistration: TipoComune.optional(),
  act: z.string().optional(),
  municipalOffice: z.string().optional(),
  municipalNumber: z.string().optional(),
  dateFormationAct: z.string().optional(),
  transcribed: z.string().optional(),
});

export const TipoAttoEvento = z.object({
  act: TipoAtto.optional(),
  actANSC: TipoAttoANSC.optional(),
});

export const TipoDatiEvento = z.object({
  eventDate: z.string().optional(),
  noDay: z.string().optional(),
  noMonth: z.string().optional(),
  eventPlace: TipoLuogoEvento.optional(),
  eventAct: TipoAttoEvento.optional(),
});

export const TipoDatiSoggettiEnte = z.object({
  generality: TipoGeneralita.optional(),
  address: z.array(TipoResidenza).optional(),
  identifiers: TipoIdentificativi.optional(),
  deathDate: TipoDatiEvento.optional(),
});

export const TipoListaSoggetti = z.object({
  subject: z.array(TipoDatiSoggettiEnte).optional(),
});

export const RichiestaAR001 = z.object({
  operationId: z.string(),
  criteria: TipoParametriRicercaAR001,
  requestData: TipoRichiestaAR001,
});

export const RispostaAR001 = z.object({
  idOp: z.string().optional(),
  subjects: TipoListaSoggetti.optional(),
  warnings: z.array(TipoErroriAnomalia).optional(),
});
