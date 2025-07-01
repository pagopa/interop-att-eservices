/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import { v4 as uuidv4 } from "uuid";
import {
  DbAddress as Address,
  DbPurpose as Purpose,
  DbSubject as Subject,
  DbUsecase as Usecase,
} from "../model/domain/models.js";

export function mapToDbPurpose(): Purpose {
  return {
    id: uuidv4(),
  };
}

export function mapSourceSubjectToDbSubject(
  sourceSubject: any // TODO: Fix the type
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

// TODO: Refactor this function to avoid complexity
// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export function mapSourceAddressToDbAddress(
  sourceAddress: any // TODO: Fix the type
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
      sourceAddress.address.civicNumber?.internalCivic?.externalStairs ?? "",
    secondary:
      sourceAddress.address.civicNumber?.internalCivic?.secondary ?? "",
    floor: sourceAddress.address.civicNumber?.internalCivic?.floor ?? "",
    nui: sourceAddress.address.civicNumber?.internalCivic?.nui ?? "",
    isolated: sourceAddress.address.civicNumber?.internalCivic?.isolated ?? "",
    latitude: sourceAddress.address?.coords?.latitude?.toString() ?? "",
    longitude: sourceAddress.address?.coords?.longitude?.toString() ?? "",
    foreign_cap: sourceAddress.foreignState?.foreignAddress.cap ?? "",
    foreign_place_description:
      sourceAddress.foreignState?.foreignAddress.place?.placeDescription ?? "",
    foreign_country_description:
      sourceAddress.foreignState?.foreignAddress.place?.countryDescription ??
      "",
    foreign_country_state:
      sourceAddress.foreignState?.foreignAddress.place?.countryState ?? "",
    foreign_province_county:
      sourceAddress.foreignState?.foreignAddress.place?.provinceCounty ?? "",
    foreign_toponym_denomination:
      sourceAddress.foreignState?.foreignAddress.toponym?.denomination ?? "",
    foreign_toponym_civic_number:
      sourceAddress.foreignState?.foreignAddress.toponym?.civicNumber ?? "",
    consulate_cod: sourceAddress.foreignState?.consulate?.consulateCod ?? "",
    consulate_description:
      sourceAddress.foreignState?.consulate?.consulateDescription ?? "",
  };
}

export function mapToDbUsecase(
  purposeId: string,
  subjectId: string,
  addressId: string
): Usecase {
  return {
    id: uuidv4(),
    purpose_id: purposeId,
    subject_id: subjectId,
    address_id: addressId,
  };
}
