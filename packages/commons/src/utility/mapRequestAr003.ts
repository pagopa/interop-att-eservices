import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { logger } from "../logging/index.js";
import { RequestAR003 } from "../zod/residence-submission/requestAR003.js";
import { Address } from "../db/schema/residence-verification/address.model.js";
import { Subject } from "../db/schema/residence-verification/subject.model.js";

type RequestAR003Type = z.infer<typeof RequestAR003>;

export function mapSourceSubjectToDbSubject(
  sourceSubject: RequestAR003Type
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

type SourceAddress = {
  addressType?: string | null;
  noteAddress?: string | null;
  addressStartDate?: string | null;
  presso?: string | null;
  address?: {
    municipality?: {
      nameMunicipality?: string | null;
      istatCode?: string | null;
      acronymIstatProvince?: string | null;
      placeDescription?: string | null;
    } | null;
    toponym?: {
      codType?: string | null;
      type?: string | null;
      originType?: string | null;
      toponymCod?: string | null;
      toponymDenomination?: string | null;
      toponymSource?: string | null;
    } | null;
    civicNumber?: {
      civicCod?: string | null;
      civicSource?: string | null;
      civicNumber?: string | null;
      metric?: string | null;
      progSNC?: string | null;
      letter?: string | null;
      exponent1?: string | null;
      color?: string | null;
      internalCivic?: {
        court?: string | null;
        stairs?: string | null;
        internal1?: string | null;
        espInternal1?: string | null;
        internal2?: string | null;
        espInternal2?: string | null;
        externalStairs?: string | null;
        secondary?: string | null;
        floor?: string | null;
        nui?: string | null;
        isolated?: string | null;
      } | null;
    } | null;
    coords?: {
      latitude?: number | string | null;
      longitude?: number | string | null;
    } | null;
  } | null;
  foreignState?: {
    foreignAddress?: {
      cap?: string | null;
      place?: {
        placeDescription?: string | null;
        countryDescription?: string | null;
        countryState?: string | null;
        provinceCounty?: string | null;
      } | null;
      toponym?: {
        denomination?: string | null;
        civicNumber?: string | null;
      } | null;
    } | null;
    consulate?: {
      consulateCod?: string | null;
      consulateDescription?: string | null;
    } | null;
  } | null;
  generality?: {
    subjectId?: {
      subjectId?: string | null;
    } | null;
  } | null;
};

function getMunicipalityData(addr: SourceAddress["address"]): {
  address_municipality_name: string;
  address_municipality_istat_code: string;
  address_municipality_acronym_istat_province: string;
  address_municipality_place_description: string;
} {
  const m = addr?.municipality;
  return {
    address_municipality_name: m?.nameMunicipality ?? "",
    address_municipality_istat_code: m?.istatCode ?? "",
    address_municipality_acronym_istat_province: m?.acronymIstatProvince ?? "",
    address_municipality_place_description: m?.placeDescription ?? "",
  };
}

function getToponymData(addr: SourceAddress["address"]): {
  toponym_cod_type: string;
  toponym_type: string;
  toponym_origin_type: string;
  toponym_cod: string;
  toponym_denomination: string;
  toponym_source: string;
} {
  const t = addr?.toponym;
  return {
    toponym_cod_type: t?.codType ?? "",
    toponym_type: t?.type ?? "",
    toponym_origin_type: t?.originType ?? "",
    toponym_cod: t?.toponymCod ?? "",
    toponym_denomination: t?.toponymDenomination ?? "",
    toponym_source: t?.toponymSource ?? "",
  };
}

function getCivicData(addr: SourceAddress["address"]): {
  civic_cod: string;
  civic_source: string;
  civic_number: string;
  metric: string;
  prog_snc: string;
  letter: string;
  exponent1: string;
  color: string;
  internal_court: string;
  internal_stairs: string;
  internal1: string;
  esp_internal1: string;
  internal2: string;
  esp_internal2: string;
  external_stairs: string;
  secondary: string;
  floor: string;
  nui: string;
  isolated: string;
} {
  const c = addr?.civicNumber;
  const ic = c?.internalCivic;
  return {
    civic_cod: c?.civicCod ?? "",
    civic_source: c?.civicSource ?? "",
    civic_number: c?.civicNumber ?? "",
    metric: c?.metric ?? "",
    prog_snc: c?.progSNC ?? "",
    letter: c?.letter ?? "",
    exponent1: c?.exponent1 ?? "",
    color: c?.color ?? "",
    internal_court: ic?.court ?? "",
    internal_stairs: ic?.stairs ?? "",
    internal1: ic?.internal1 ?? "",
    esp_internal1: ic?.espInternal1 ?? "",
    internal2: ic?.internal2 ?? "",
    esp_internal2: ic?.espInternal2 ?? "",
    external_stairs: ic?.externalStairs ?? "",
    secondary: ic?.secondary ?? "",
    floor: ic?.floor ?? "",
    nui: ic?.nui ?? "",
    isolated: ic?.isolated ?? "",
  };
}

function getCoordsData(addr: SourceAddress["address"]): {
  latitude: string;
  longitude: string;
} {
  const coords = addr?.coords;
  return {
    latitude: coords?.latitude?.toString() ?? "",
    longitude: coords?.longitude?.toString() ?? "",
  };
}

function getForeignData(foreignState: SourceAddress["foreignState"]): {
  foreign_cap: string;
  foreign_place_description: string;
  foreign_country_description: string;
  foreign_country_state: string;
  foreign_province_county: string;
  foreign_toponym_denomination: string;
  foreign_toponym_civic_number: string;
  consulate_cod: string;
  consulate_description: string;
} {
  const fa = foreignState?.foreignAddress;
  const fp = fa?.place;
  const ft = fa?.toponym;
  const c = foreignState?.consulate;
  return {
    foreign_cap: fa?.cap ?? "",
    foreign_place_description: fp?.placeDescription ?? "",
    foreign_country_description: fp?.countryDescription ?? "",
    foreign_country_state: fp?.countryState ?? "",
    foreign_province_county: fp?.provinceCounty ?? "",
    foreign_toponym_denomination: ft?.denomination ?? "",
    foreign_toponym_civic_number: ft?.civicNumber ?? "",
    consulate_cod: c?.consulateCod ?? "",
    consulate_description: c?.consulateDescription ?? "",
  };
}

export function mapSourceAddressToDbAddress(
  sourceAddress: SourceAddress
): Address {
  return {
    id: uuidv4(),
    address_type: sourceAddress.addressType ?? "",
    note_address: sourceAddress.noteAddress ?? "",
    address_start_date: sourceAddress.addressStartDate ?? "",
    presso: sourceAddress.presso ?? "",
    ...getMunicipalityData(sourceAddress.address),
    ...getToponymData(sourceAddress.address),
    ...getCivicData(sourceAddress.address),
    ...getCoordsData(sourceAddress.address),
    ...getForeignData(sourceAddress.foreignState),
    subject_id: sourceAddress.generality?.subjectId?.subjectId ?? "",
  };
}

export function mapApiBodyToDbModels(subjectBody: RequestAR003Type): {
  subject: Subject;
  addresses: Address[];
} {
  try {
    const subject = mapSourceSubjectToDbSubject(subjectBody);
    const addresses: Address[] = [];

    const addressList: Address[] = Array.isArray(subjectBody.address)
      ? subjectBody.address
      : subjectBody.address
      ? [subjectBody.address]
      : [];

    if (addressList.length === 0) {
      throw new Error("Missing address in request body");
    }

    for (const sourceAddress of addressList) {
      try {
        const dbAddress = mapSourceAddressToDbAddress(sourceAddress);
        // eslint-disable-next-line functional/immutable-data
        addresses.push(dbAddress);
      } catch (error) {
        logger.error("Error during address conversion:", error, sourceAddress);
      }
    }

    return { subject, addresses };
  } catch (error) {
    logger.error(
      "Error during subject/address conversion in mapApiBodyToDbModels:",
      error
    );
    throw error;
  }
}

export function mapApiBodyToDbModelsUpdate(subjectBody: RequestAR003Type): {
  subject: Subject;
  addresses: Address[];
} {
  try {
    const subject: Subject = mapSourceSubjectToDbSubject(subjectBody);

    const addressList = Array.isArray(subjectBody.address)
      ? subjectBody.address
      : subjectBody.address
      ? [subjectBody.address]
      : [];

    if (addressList.length === 0) {
      throw new Error("Missing address in request body");
    }

    const addresses: Address[] = addressList.map((sourceAddress: Address) => {
      const mappedAddress = mapSourceAddressToDbAddress(sourceAddress);
      return {
        ...mappedAddress,
        subject_id: subject.subject_id,
      };
    });

    return {
      subject,
      addresses,
    };
  } catch (error) {
    logger.error(
      "Error during subject/address conversion in mapApiBodyToDbModelsUpdate:",
      error
    );
    throw error;
  }
}
