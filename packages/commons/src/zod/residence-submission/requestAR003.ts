import { z, ZodType } from "zod";

const MunicipalityType = z
  .object({
    nameMunicipality: z.string(),
    istatCode: z.string(),
    acronymIstatProvince: z.string(),
    placeDescription: z.string(),
  })
  .partial()
  .passthrough();

const PlaceType = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    codState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();

const BirthPlaceType = z
  .object({
    exceptionalPlace: z.string(),
    municipality: MunicipalityType,
    place: PlaceType,
  })
  .partial()
  .passthrough();

const CodiceFiscaleType = z
  .object({
    subjectId: z.string(),
    subjectIdValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .partial()
  .passthrough();

const IdSchedaSoggettoComuneType = z
  .object({
    idCommonSubjectDataIstat: z.string(),
    idSubjectData: z.string(),
  })
  .partial()
  .passthrough();

const GeneralitaType = z
  .object({
    subjectId: CodiceFiscaleType,
    surname: z.string(),
    noSurname: z.string(),
    name: z.string(),
    noName: z.string(),
    gender: z.string(),
    birthDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    birthPlace: BirthPlaceType,
    AIRESubject: z.string(),
    yearExpatriation: z.string(),
    idCommonSubjectData: IdSchedaSoggettoComuneType,
    idSubjectData: z.string(),
    note: z.string(),
  })
  .partial()
  .passthrough();

const ToponimoType = z
  .object({
    codType: z.string(),
    type: z.string(),
    originType: z.string(),
    toponymCod: z.string(),
    toponymDenomination: z.string(),
    toponymSource: z.string(),
  })
  .partial()
  .passthrough();

const CivicoInternoType = z
  .object({
    court: z.string(),
    stairs: z.string(),
    internal1: z.string(),
    espInternal1: z.string(),
    internal2: z.string(),
    espInternal2: z.string(),
    externalStairs: z.string(),
    secondary: z.string(),
    floor: z.string(),
    nui: z.string(),
    isolated: z.string(),
  })
  .partial()
  .passthrough();

const NumeroCivicoType = z
  .object({
    civicCod: z.string(),
    civicSource: z.string(),
    civicNumber: z.string(),
    metric: z.string(),
    progSNC: z.string(),
    letter: z.string(),
    exponent1: z.string(),
    color: z.string(),
    internalCivic: CivicoInternoType,
  })
  .partial()
  .passthrough();

const IndirizzoType = z
  .object({
    cap: z.string(),
    municipality: MunicipalityType,
    fraction: z.string(),
    toponym: ToponimoType,
    civicNumber: NumeroCivicoType,
  })
  .partial()
  .passthrough();

const DatoLocalitaEsteraType = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    countryState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();

const ToponimoEsteroType = z
  .object({
    denomination: z.string(),
    civicNumber: z.string(),
  })
  .partial()
  .passthrough();

const IndirizzoEsteroType = z
  .object({
    cap: z.string(),
    place: DatoLocalitaEsteraType,
    toponym: ToponimoEsteroType,
  })
  .partial()
  .passthrough();

const ConsolatoType = z
  .object({
    consulateCod: z.string(),
    consulateDescription: z.string(),
  })
  .partial()
  .passthrough();

const LocalitaEsteraType = z
  .object({
    foreignAddress: IndirizzoEsteroType,
    consulate: ConsolatoType,
  })
  .partial()
  .passthrough();

const ResidenzaType = z
  .object({
    addressType: z.string(),
    noteaddress: z.string(),
    address: IndirizzoType,
    foreignState: LocalitaEsteraType,
    presso: z.string(),
    addressStartDate: z.string(),
  })
  .partial()
  .passthrough();

const IdentificativiType = z
  .object({
    id: z.string(),
  })
  .partial()
  .passthrough();

const AttoType = z
  .object({
    municipalityRegistration: MunicipalityType,
    municipalOffice: z.string(),
    year: z.string(),
    part: z.string(),
    series: z.string(),
    actNumber: z.string(),
    volume: z.string(),
    dateFormationAct: z.string(),
    transcribed: z.string(),
  })
  .partial()
  .passthrough();

const AttoANSCType = z
  .object({
    idANSC: z.string(),
    municipalityRegistration: MunicipalityType,
    act: z.string(),
    municipalOffice: z.string(),
    municipalNumber: z.string(),
    dateFormationAct: z.string(),
    transcribed: z.string(),
  })
  .partial()
  .passthrough();

const AttoEventoType = z
  .object({
    act: AttoType,
    actANSC: AttoANSCType,
  })
  .partial()
  .passthrough();

const DatiEventoType = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    eventPlace: BirthPlaceType,
    eventAct: AttoEventoType,
  })
  .partial()
  .passthrough();

const DatiSoggettoType = z
  .object({
    generality: GeneralitaType,
    address: ResidenzaType, // CORRETTO: Oggetto singolo
    identifiers: IdentificativiType,
    deathDate: DatiEventoType,
  })
  .partial()
  .passthrough();

const ListaSoggettiType = z
  .object({
    subject: DatiSoggettoType,
  })
  .partial()
  .passthrough();

const RichiestaAR003Schema = z
  .object({
    idOp: z.string(),
    subjects: ListaSoggettiType,
  })
  .partial()
  .passthrough();

export const RequestAR003: ZodType = RichiestaAR003Schema;
