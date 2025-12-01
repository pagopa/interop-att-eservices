import { v4 as uuidv4 } from "uuid";
import { logger } from "../logging/index.js";
import { Subject } from "../db/schema/residence-verification/subject.model.js";
import { Address } from "../db/schema/residence-verification/address.model.js";
import {
  TipoDatiSoggettiEnte,
  TipoResidenza,
  RichiestaAR003,
} from "../db/model/residence-submission.js";

type MappedDataStrict = {
  subject: Subject;
  address: Address | undefined;
};

type MappedDataUpdate = {
  subject: Partial<Subject>;
  address: Partial<Address>;
};

// Interfaccia per tipizzare l'oggetto che otteniamo dal parsing della data
interface BirthDateStructure {
  eventDate?: string | number;
  birthPlace?: unknown;
  noDay?: string | boolean;
  noMonth?: string | boolean;
}

const val = (v?: string | null): string => v ?? "";

const parseJsonSafe = (input: unknown): unknown => {
  if (typeof input === "string" && input.trim().startsWith("{")) {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  }
  return null;
};

const extractBirthData = (
  gen: TipoDatiSoggettiEnte["generality"]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { date: string; place: any; noDay: string; noMonth: string } => {
  const rawDate = gen?.birthDate;

  const parsed = parseJsonSafe(rawDate);

  const sourceObj = (
    typeof rawDate === "object" && rawDate !== null ? rawDate : parsed
  ) as BirthDateStructure | null;

  const place = sourceObj?.birthPlace ?? gen?.birthPlace;

  const date = sourceObj?.eventDate
    ? String(sourceObj.eventDate)
    : typeof rawDate === "string" && !rawDate.trim().startsWith("{")
    ? rawDate
    : "";

  const noDay = sourceObj?.noDay ?? gen?.noDay;
  const noMonth = sourceObj?.noMonth ?? gen?.noMonth;

  return {
    date,
    place,
    noDay: String(noDay ?? ""),
    noMonth: String(noMonth ?? ""),
  };
};

const getAddressUpdateData = (address?: Address): Partial<Address> => {
  if (!address) {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, subject_id, ...rest } = address;
  return rest;
};

function mapSubject(source: TipoDatiSoggettiEnte): Subject {
  const gen = source.generality;
  const {
    date: cleanBirthDate,
    place: birth,
    noDay,
    noMonth,
  } = extractBirthData(gen);

  return {
    uuid: uuidv4(),
    id: val(gen?.idSubjectData),
    subject_id: val(gen?.subjectId?.subjectId),
    surname: val(gen?.surname),
    no_surname: val(gen?.noSurname),
    name: val(gen?.name),
    no_name: val(gen?.noName),
    gender: val(gen?.gender),
    birth_event_date: cleanBirthDate,
    birth_no_day: noDay,
    birth_no_day_month: noMonth,
    birth_exceptional_place: val(birth?.exceptionalPlace),
    birth_municipality_name: val(birth?.municipality?.nameMunicipality),
    birth_municipality_istat_code: val(birth?.municipality?.istatCode),
    birth_municipality_acronym_istat_province: val(
      birth?.municipality?.acronymIstatProvince
    ),
    birth_municipality_place_description: val(
      birth?.municipality?.placeDescription
    ),
    birth_place_description: val(birth?.place?.placeDescription),
    birth_country_description: val(birth?.place?.countryDescription),
    birth_cod_state: val(birth?.place?.codState),
    birth_province_county: val(birth?.place?.provinceCounty),
  } as unknown as Subject;
}

function mapAddress(
  sourceResidenza: TipoResidenza,
  subjectId: string
): Address {
  const addr = sourceResidenza.address;
  const foreign = sourceResidenza.foreignState;
  const civic = addr?.civicNumber;
  const internal = civic?.internalCivic;

  return {
    id: uuidv4(),
    subject_id: subjectId,
    address_type: val(sourceResidenza.addressType),
    note_address: val(sourceResidenza.noteaddress),
    address_start_date: val(sourceResidenza.addressStartDate),
    presso: val(sourceResidenza.presso),
    address_municipality_name: val(addr?.municipality?.nameMunicipality),
    address_municipality_istat_code: val(addr?.municipality?.istatCode),
    address_municipality_acronym_istat_province: val(
      addr?.municipality?.acronymIstatProvince
    ),
    address_municipality_place_description: val(
      addr?.municipality?.placeDescription
    ),
    cap: val(addr?.cap),
    fraction: val(addr?.fraction),
    toponym_cod_type: val(addr?.toponym?.codType),
    toponym_type: val(addr?.toponym?.type),
    toponym_origin_type: val(addr?.toponym?.originType),
    toponym_cod: val(addr?.toponym?.toponymCod),
    toponym_denomination: val(addr?.toponym?.toponymDenomination),
    toponym_source: val(addr?.toponym?.toponymSource),
    civic_cod: val(civic?.civicCod),
    civic_source: val(civic?.civicSource),
    civic_number: val(civic?.civicNumber),
    metric: val(civic?.metric),
    prog_snc: val(civic?.progSNC),
    letter: val(civic?.letter),
    exponent1: val(civic?.exponent1),
    color: val(civic?.color),
    internal_court: val(internal?.court),
    internal_stairs: val(internal?.stairs),
    internal1: val(internal?.internal1),
    esp_internal1: val(internal?.espInternal1),
    internal2: val(internal?.internal2),
    esp_internal2: val(internal?.espInternal2),
    external_stairs: val(internal?.externalStairs),
    secondary: val(internal?.secondary),
    floor: val(internal?.floor),
    nui: val(internal?.nui),
    isolated: val(internal?.isolated),
    foreign_cap: val(foreign?.foreignAddress?.cap),
    foreign_place_description: val(
      foreign?.foreignAddress?.place?.placeDescription
    ),
    foreign_country_description: val(
      foreign?.foreignAddress?.place?.countryDescription
    ),
    foreign_country_state: val(foreign?.foreignAddress?.place?.countryState),
    foreign_province_county: val(
      foreign?.foreignAddress?.place?.provinceCounty
    ),
    foreign_toponym_denomination: val(
      foreign?.foreignAddress?.toponym?.denomination
    ),
    foreign_toponym_civic_number: val(
      foreign?.foreignAddress?.toponym?.civicNumber
    ),
    consulate_cod: val(foreign?.consulate?.consulateCod),
    consulate_description: val(foreign?.consulate?.consulateDescription),
    latitude: "",
    longitude: "",
  } as unknown as Address;
}

export function mapApiBodyToDbModels(
  request: RichiestaAR003
): MappedDataStrict {
  logger.info("DEBUG MAPPER INPUT:", JSON.stringify(request, null, 2));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqAny = request as any;
  const sourceSubject = reqAny.subjects?.subject;

  if (!sourceSubject?.generality) {
    logger.error("Missing generality data in request");
    throw new Error("Missing generality data in request");
  }

  const dbSubject = mapSubject(sourceSubject);

  const dbAddress = sourceSubject.address
    ? mapAddress(sourceSubject.address, dbSubject.subject_id)
    : undefined;

  return {
    subject: dbSubject,
    address: dbAddress,
  };
}

export function mapApiBodyToDbModelsUpdate(
  request: RichiestaAR003
): MappedDataUpdate {
  try {
    const fullMapped = mapApiBodyToDbModels(request);
    const fullSubject = fullMapped.subject;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, uuid, ...subjectWithoutIds } = fullSubject;

    const partialAddress = getAddressUpdateData(fullMapped.address);

    return {
      subject: subjectWithoutIds,
      address: partialAddress,
    };
  } catch (error) {
    logger.error("Error in mapApiBodyToDbModelsUpdate:", error);
    throw error;
  }
}
