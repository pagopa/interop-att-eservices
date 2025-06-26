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

function mapMunicipality(municipality: any): TipoComuneModel {
  return {
    nameMunicipality: municipality?.nameMunicipality ?? "",
    istatCode: municipality?.istatCode ?? "",
    acronymIstatProvince: municipality?.acronymIstatProvince ?? "",
    placeDescription: municipality?.placeDescription ?? "",
  };
}

function mapToponym(toponym: any): TipoToponimoModel {
  return {
    codType: toponym?.codType ?? "",
    type: toponym?.type ?? "",
    originType: toponym?.originType ?? "",
    toponymCod: toponym?.toponymCod ?? "",
    toponymDenomination: toponym?.toponymDenomination ?? "",
    toponymSource: toponym?.toponymSource ?? "",
  };
}

function mapCivicNumber(civicNumber: any): TipoNumeroCivicoModel {
  return {
    civicCod: civicNumber?.civicCod ?? "",
    civicSource: civicNumber?.civicSource ?? "",
    civicNumber: civicNumber?.civicNumber ?? "",
    metric: civicNumber?.metric ?? "",
    progSNC: civicNumber?.progSNC ?? "",
    letter: civicNumber?.letter ?? "",
    exponent1: civicNumber?.exponent1 ?? "",
    color: civicNumber?.color ?? "",
    internalCivic: {
      court: civicNumber?.internalCivic?.court ?? "",
      stairs: civicNumber?.internalCivic?.stairs ?? "",
      internal1: civicNumber?.internalCivic?.internal1 ?? "",
      espInternal1: civicNumber?.internalCivic?.espInternal1 ?? "",
      internal2: civicNumber?.internalCivic?.internal2 ?? "",
      espInternal2: civicNumber?.internalCivic?.espInternal2 ?? "",
      externalStairs: civicNumber?.internalCivic?.externalStairs ?? "",
      secondary: civicNumber?.internalCivic?.secondary ?? "",
      floor: civicNumber?.internalCivic?.floor ?? "",
      nui: civicNumber?.internalCivic?.nui ?? "",
      isolated: civicNumber?.internalCivic?.isolated ?? "",
    },
  };
}

function mapForeignState(foreignState: any): TipoLocalitaEsteraModel {
  return {
    foreignAddress: {
      cap: foreignState?.foreignAddress?.cap ?? "",
      place: {
        placeDescription:
          foreignState?.foreignAddress?.place?.placeDescription ?? "",
        countryDescription:
          foreignState?.foreignAddress?.place?.countryDescription ?? "",
        countryState: foreignState?.foreignAddress?.place?.countryState ?? "",
        provinceCounty:
          foreignState?.foreignAddress?.place?.provinceCounty ?? "",
      },
      toponym: {
        denomination: foreignState?.foreignAddress?.toponym?.denomination ?? "",
        civicNumber: foreignState?.foreignAddress?.toponym?.civicNumber ?? "",
      },
    },
    consulate: {
      consulateCod: foreignState?.consulate?.consulateCod ?? "",
      consulateDescription: foreignState?.consulate?.consulateDescription ?? "",
    },
  };
}

function mapAddressData(address: any): TipoResidenzaModel {
  return {
    addressType: address?.addressType ?? "",
    noteAddress: address?.noteaddress ?? "",
    addressStartDate: address?.addressStartDate ?? "",
    presso: address?.presso ?? "",
    address: {
      cap: address?.address?.cap ?? "",
      municipality: mapMunicipality(address?.address?.municipality),
      fraction: address?.address?.fraction ?? "",
      toponym: mapToponym(address?.address?.toponym),
      civicNumber: mapCivicNumber(address?.address?.civicNumber),
      coords: address?.coords,
    },
    foreignState: mapForeignState(address?.foreignState),
  };
}

function mapBirthPlace(birthPlace: any): TipoLuogoNascitaModel {
  return {
    exceptionalPlace: birthPlace?.exceptionalPlace ?? "",
    municipality: mapMunicipality(birthPlace?.municipality),
    place: {
      placeDescription: birthPlace?.place?.placeDescription ?? "",
      countryDescription: birthPlace?.place?.countryDescription ?? "",
      codState: birthPlace?.place?.codState ?? "",
      provinceCounty: birthPlace?.place?.provinceCounty ?? "",
    },
  };
}

function mapSubjectData(subject: any): SoggettoModel {
  return {
    subjectId: subject?.subjectId?.subjectId ?? "",
    id: subject?.id ?? "",
    surname: subject?.surname ?? "",
    name: subject?.name ?? "",
    gender: subject?.gender ?? "",
    birthDate: {
      eventDate: subject?.birthDate ?? "",
      birthPlace: mapBirthPlace(subject?.birthPlace),
    },
  };
}

export async function mapUserModel(
  uuid: string,
  subject: any,
  address: any
): Promise<UserModel> {
  try {
    return {
      uuid,
      subject: mapSubjectData(subject),
      address: address.map((addr: any) => mapAddressData(addr)),
    };
  } catch (error) {
    logger.error("Error while mapping the UserModel:", error);
    throw new Error("An error occurred while creating the user model.");
  }
}
