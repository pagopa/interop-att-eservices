import {
  SoggettoModel,
  TipoComuneModel,
  TipoLocalitaEsteraModel,
  TipoLuogoNascitaModel,
  TipoNumeroCivicoModel,
  TipoResidenzaModel,
  TipoToponimoModel,
  UserModel,
} from "pdnd-models";
import { logger } from "pdnd-common";
import { Address } from "../model/db/address.model.js";
import { Subject } from "../model/db/subject.model.js";

function mapMunicipality(address: Address): TipoComuneModel {
  return {
    nameMunicipality: address.address_municipality_name ?? "",
    istatCode: address.address_municipality_istat_code ?? "",
    acronymIstatProvince:
      address.address_municipality_acronym_istat_province ?? "",
    placeDescription: address.address_municipality_place_description ?? "",
  };
}

function mapToponym(address: Address): TipoToponimoModel {
  return {
    codType: address.toponym_cod_type ?? "",
    type: address.toponym_type ?? "",
    originType: address.toponym_origin_type ?? "",
    toponymCod: address.toponym_cod ?? "",
    toponymDenomination: address.toponym_denomination ?? "",
    toponymSource: address.toponym_source ?? "",
  };
}

function mapCivicNumber(address: Address): TipoNumeroCivicoModel {
  return {
    civicCod: address.civic_cod ?? "",
    civicSource: address.civic_source ?? "",
    civicNumber: address.civic_number ?? "",
    metric: address.metric ?? "",
    progSNC: address.prog_snc ?? "",
    letter: address.letter ?? "",
    exponent1: address.exponent1 ?? "",
    color: address.color ?? "",
    internalCivic: {
      court: address.internal_court ?? "",
      stairs: address.internal_stairs ?? "",
      internal1: address.internal1 ?? "",
      espInternal1: address.esp_internal1 ?? "",
      internal2: address.internal2 ?? "",
      espInternal2: address.esp_internal2 ?? "",
      externalStairs: address.external_stairs ?? "",
      secondary: address.secondary ?? "",
      floor: address.floor ?? "",
      nui: address.nui ?? "",
      isolated: address.isolated ?? "",
    },
  };
}

function mapForeignState(address: Address): TipoLocalitaEsteraModel {
  return {
    foreignAddress: {
      cap: address.foreign_cap ?? "",
      place: {
        placeDescription: address.foreign_place_description ?? "",
        countryDescription: address.foreign_country_description ?? "",
        countryState: address.foreign_country_state ?? "",
        provinceCounty: address.foreign_province_county ?? "",
      },
      toponym: {
        denomination: address.foreign_toponym_denomination ?? "",
        civicNumber: address.foreign_toponym_civic_number ?? "",
      },
    },
    consulate: {
      consulateCod: address.consulate_cod ?? "",
      consulateDescription: address.consulate_description ?? "",
    },
  };
}

function mapAddressData(address: Address): TipoResidenzaModel {
  return {
    addressType: address.address_type ?? "",
    noteaddress: address.note_address ?? "",
    addressStartDate: address.address_start_date ?? "",
    presso: address.presso ?? "",
    address: {
      cap: address.foreign_cap ?? "",
      municipality: mapMunicipality(address),
      fraction: "",
      toponym: mapToponym(address),
      civicNumber: mapCivicNumber(address),
    },
    foreignState: mapForeignState(address),
  };
}

function mapBirthPlace(subject: Subject): TipoLuogoNascitaModel {
  return {
    exceptionalPlace: subject.birth_exceptional_place ?? "",
    municipality: {
      nameMunicipality: subject.birth_municipality_name ?? "",
      istatCode: subject.birth_municipality_istat_code ?? "",
      acronymIstatProvince:
        subject.birth_municipality_acronym_istat_province ?? "",
      placeDescription: subject.birth_municipality_place_description ?? "",
    },
    place: {
      placeDescription: subject.birth_place_description ?? "",
      countryDescription: subject.birth_country_description ?? "",
      codState: subject.birth_cod_state ?? "",
      provinceCounty: subject.birth_province_county ?? "",
    },
  };
}

function mapSubjectData(subject: Subject): SoggettoModel {
  return {
    subjectId: subject.subject_id ?? "",
    id: subject.id ?? "",
    surname: subject.surname ?? "",
    name: subject.name ?? "",
    gender: subject.gender ?? "",
    birthDate: {
      eventDate: subject.birth_event_date ?? "",
      birthPlace: mapBirthPlace(subject),
    },
  };
}

export async function mapUserModel(
  uuid: string,
  subject: Subject,
  address: Address
): Promise<UserModel> {
  try {
    return {
      uuid,
      subject: mapSubjectData(subject),
      address: mapAddressData(address),
    };
  } catch (error) {
    logger.error("Error while mapping the UserModel:", error);
    throw new Error("An error occurred while creating the user model.");
  }
}
