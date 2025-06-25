// import {
  // SoggettoModel,
  // UserModel,
  // TipoLuogoNascitaModel,
  // TipoLocalitaModel,
  // TipoComuneModel,
  // TipoDataNascitaModel,
  // TipoToponimoModel,
  // TipoCivicoInternoModel,
  // TipoNumeroCivicoModel,
  // TipoIndirizzoModel,
  // TipoDatoLocalitaEsteraModel,
  // TipoToponimoEsteroModel,
  // TipoIndirizzoEsteroModel,
  // TipoConsolatoModel,
  // TipoLocalitaEsteraModel,
  // TipoResidenzaModel,
  // TipoDatiNascitaModel,
  // TipoParametriRicercaModel,
  // TipoRichiestaModel,
  // RichiestaModel,
  // TipoCodiceFiscaleModel,
  // TipoLuogoEventoModel,
  // TipoIdSchedaSoggettoComuneModel,
  // TipoGeneralitaModel,
  // TipoIdentificativiModel,
  // TipoAttoModel,
  // TipoAttoANSCModel,
  // TipoAttoEventoModel,
  // TipoDatiEventoModel,
  // TipoDatiSoggettiEnteModel,
  // TipoListaSoggettiModel,
  // TipoErroriAnomaliaModel,
  // ProblemErrorModel,
  // ProblemModel,
// } from "pdnd-models";
// import { getUserModelByCodiceFiscale } from "../../utilities/userUtilities.js";
// import {
//   generateRandomUUID,
//   isValidUUID,
// } from "../../utilities/uuidUtilities.js";

// TODO: Make error handling for field missing or invalid

import { v4 as uuidv4 } from "uuid";

interface Address {
  id: string;
  address_type: string | "";
  note_address: string | "";
  address_start_date: string | "";
  presso: string | "";
  address_municipality_name: string | "";
  address_municipality_istat_code: string | "";
  address_municipality_acronym_istat_province: string | "";
  address_municipality_place_description: string | "";
  toponym_cod_type: string | "";
  toponym_type: string | "";
  toponym_origin_type: string | "";
  toponym_cod: string | "";
  toponym_denomination: string | "";
  toponym_source: string | "";
  civic_cod: string | "";
  civic_source: string | "";
  civic_number: string | "";
  metric: string | "";
  prog_snc: string | "";
  letter: string | "";
  exponent1: string | "";
  color: string | "";
  internal_court: string | "";
  internal_stairs: string | "";
  internal1: string | "";
  esp_internal1: string | "";
  internal2: string | "";
  esp_internal2: string | "";
  external_stairs: string | "";
  secondary: string | "";
  floor: string | "";
  nui: string | "";
  isolated: string | "";
  latitude: string | "";
  longitude: string | "";
  foreign_cap: string | "";
  foreign_place_description: string | "";
  foreign_country_description: string | "";
  foreign_country_state: string | "";
  foreign_province_county: string | "";
  foreign_toponym_denomination: string | "";
  foreign_toponym_civic_number: string | "";
  consulate_cod: string | "";
  consulate_description: string | "";
}

interface Purpose {
  id: string;
}

interface Subject {
  uuid: string; //TODO: to fix
  id: string | "";
  subject_id: string | "";
  surname: string | "";
  name: string | "";
  gender: string | "";
  birth_event_date: string | "";
  birth_exceptional_place: string | "";
  birth_municipality_name: string | "";
  birth_municipality_istat_code: string | "";
  birth_municipality_acronym_istat_province: string | "";
  birth_municipality_place_description: string | "";
  birth_place_description: string | "";
  birth_country_description: string | "";
  birth_cod_state: string | "";
  birth_province_county: string | "";
}

interface Usecase {
  id: string;
  purpose_id: string;
  subject_id: string;
  address_id: string;
}

interface MappedDbData {
  purpose: Purpose;
  subject: Subject;
  addresses: Address[];
  usecases: Usecase[];
}



function mapToDbPurpose(): Purpose {
  return {
    id: uuidv4(),
  };
}

function mapSourceSubjectToDbSubject(
  sourceSubject: any, // TODO: Fix the type
): Subject {
  return {
    uuid: uuidv4(),
    id: sourceSubject?.identifiers?.id ?? "",
    subject_id: sourceSubject?.generality?.subjectId?.subjectId ?? "",
    surname: sourceSubject?.generality?.surname ?? "",
    name: sourceSubject?.generality?.name ?? "",
    gender: sourceSubject?.generality?.gender ?? "",
    birth_event_date: sourceSubject?.generality?.birthDate ?? "",
    birth_exceptional_place:
      sourceSubject?.generality?.birthPlace?.exceptionalPlace ?? "",
    birth_municipality_name:
      sourceSubject?.generality?.birthPlace?.municipality?.nameMunicipality ??
      "",
    birth_municipality_istat_code:
      sourceSubject?.generality?.birthPlace?.municipality?.istatCode ?? "",
    birth_municipality_acronym_istat_province:
      sourceSubject?.generality?.birthPlace?.municipality
        ?.acronymIstatProvince ?? "",
    birth_municipality_place_description:
      sourceSubject?.generality?.birthPlace?.municipality?.placeDescription ??
      "",
    birth_place_description:
      sourceSubject?.generality?.birthPlace?.place?.placeDescription ?? "",
    birth_country_description:
      sourceSubject?.generality?.birthPlace?.place?.countryDescription ?? "",
    birth_cod_state:
      sourceSubject?.generality?.birthPlace?.place?.codState ?? "",
    birth_province_county:
      sourceSubject?.generality?.birthPlace?.place?.provinceCounty ?? "",
  };
}

function mapSourceAddressToDbAddress(
  sourceAddress: any, // TODO: Fix the type
): Address {
  return {
    id: uuidv4(),
    address_type: sourceAddress.addressType ?? "",
    note_address: sourceAddress.noteAddress ?? "",
    address_start_date: sourceAddress.addressStartDate ?? "",
    presso: sourceAddress.presso ?? "",
    address_municipality_name:
      sourceAddress.address.municipality?.nameMunicipality ?? "",
    address_municipality_istat_code:
      sourceAddress.address.municipality?.istatCode ?? "",
    address_municipality_acronym_istat_province:
      sourceAddress.address.municipality?.acronymIstatProvince ?? "",
    address_municipality_place_description:
      sourceAddress.address.municipality?.placeDescription ?? "",
    toponym_cod_type: sourceAddress.address.toponym?.codType ?? "",
    toponym_type: sourceAddress.address.toponym?.type ?? "",
    toponym_origin_type: sourceAddress.address.toponym?.originType ?? "",
    toponym_cod: sourceAddress.address.toponym?.toponymCod ?? "",
    toponym_denomination:
      sourceAddress.address.toponym?.toponymDenomination ?? "",
    toponym_source: sourceAddress.address.toponym?.toponymSource ?? "",
    civic_cod: sourceAddress.address.civicNumber?.civicCod ?? "",
    civic_source: sourceAddress.address.civicNumber?.civicSource ?? "",
    civic_number: sourceAddress.address.civicNumber?.civicNumber ?? "",
    metric: sourceAddress.address.civicNumber?.metric ?? "",
    prog_snc: sourceAddress.address.civicNumber?.progSNC ?? "",
    letter: sourceAddress.address.civicNumber?.letter ?? "",
    exponent1: sourceAddress.address.civicNumber?.exponent1 ?? "",
    color: sourceAddress.address.civicNumber?.color ?? "",
    internal_court:
      sourceAddress.address.civicNumber?.internalCivic?.court ?? "",
    internal_stairs:
      sourceAddress.address.civicNumber?.internalCivic?.stairs ?? "",
    internal1:
      sourceAddress.address.civicNumber?.internalCivic?.internal1 ?? "",
    esp_internal1:
      sourceAddress.address.civicNumber?.internalCivic?.espInternal1 ?? "",
    internal2:
      sourceAddress.address.civicNumber?.internalCivic?.internal2 ?? "",
    esp_internal2:
      sourceAddress.address.civicNumber?.internalCivic?.espInternal2 ?? "",
    external_stairs:
      sourceAddress.address.civicNumber?.internalCivic?.externalStairs ??
      "",
    secondary:
      sourceAddress.address.civicNumber?.internalCivic?.secondary ?? "",
    floor: sourceAddress.address.civicNumber?.internalCivic?.floor ?? "",
    nui: sourceAddress.address.civicNumber?.internalCivic?.nui ?? "",
    isolated:
      sourceAddress.address.civicNumber?.internalCivic?.isolated ?? "",
    latitude: (sourceAddress.address as any)?.coords?.latitude?.toString() ?? "",
    longitude: (sourceAddress.address as any)?.coords?.longitude?.toString() ?? "",
    foreign_cap: sourceAddress.foreignState?.foreignAddress.cap ?? "",
    foreign_place_description:
      sourceAddress.foreignState?.foreignAddress.place?.placeDescription ??
      "",
    foreign_country_description:
      sourceAddress.foreignState?.foreignAddress.place?.countryDescription ??
      "",
    foreign_country_state:
      sourceAddress.foreignState?.foreignAddress.place?.countryState ?? "",
    foreign_province_county:
      sourceAddress.foreignState?.foreignAddress.place?.provinceCounty ??
      "",
    foreign_toponym_denomination:
      sourceAddress.foreignState?.foreignAddress.toponym?.denomination ??
      "",
    foreign_toponym_civic_number:
      sourceAddress.foreignState?.foreignAddress.toponym?.civicNumber ?? "",
    consulate_cod: sourceAddress.foreignState?.consulate?.consulateCod ?? "",
    consulate_description:
      sourceAddress.foreignState?.consulate?.consulateDescription ?? "",
  };
}

function mapToDbUsecase(
  purposeId: string,
  subjectId: string,
  addressId: string,
): Usecase {
  return {
    id: uuidv4(),
    purpose_id: purposeId,
    subject_id: subjectId,
    address_id: addressId,
  };
}

export function mapApiBodyToDbModels(
  subjectBody: any,
): MappedDbData {

  const addresses: Address[] = [];
  const usecases: Usecase[] = [];

  const subject: Subject = mapSourceSubjectToDbSubject(subjectBody);
  const purpose = mapToDbPurpose();

  if (subjectBody.address && Array.isArray(subjectBody.address)) {
    for (const sourceAddress of subjectBody.address) {
      const newDbAddress = mapSourceAddressToDbAddress(sourceAddress);
      addresses.push(newDbAddress);

      const newDbUsecase = mapToDbUsecase(
        purpose.id,
        subject.uuid,
        newDbAddress.id
      );
      usecases.push(newDbUsecase);
    }
  }  

  return { purpose, subject, addresses, usecases };
}


// TODO: Fix the type of subjectBody and addressBody with subject_id
export function mapApiBodyToDbModelsUpdate(
  subjectBody: any,
  subjectUuid: string,
  addressUuid: string,
): {
  subject: Subject;
  address: Address;
} {
  const subjectMapped = mapSourceSubjectToDbSubject(subjectBody);

  subjectMapped.uuid = subjectUuid;
  
  let mappedAddress: Address;
  const mapped = mapSourceAddressToDbAddress(
    subjectBody.address[0], // TODO: Fix array management
  );

  mapped.id = addressUuid || "";
  mappedAddress = mapped;

  return {
    subject: subjectMapped,
    address: mappedAddress,
  };
}

