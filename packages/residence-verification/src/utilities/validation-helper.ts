/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MismatchPayload } from "../exceptions/errors.js";
import { InternalRequestAR002 } from "../model/internal-model.js";
import { RES_ENG_TO_ITA_KEYS } from "./residence-mappings.js";
const translateField = (fieldName: string): string => {
  const entry = Object.entries(RES_ENG_TO_ITA_KEYS).find(
    ([key]) => key === fieldName || key.endsWith(`.${fieldName}`)
  );
  if (entry) {
    return entry[1];
  }

  return RES_ENG_TO_ITA_KEYS[fieldName] || fieldName;
};

const getTrimmedString = (value: any): string =>
  value !== undefined && value !== null ? String(value).trim() : "";

const normalizeStringForComparison = (str: string): string =>
  str.replace(/[^a-z0-9]/g, "").toLowerCase();

const createMismatchPayload = (
  rawFieldName: string,
  requestValue: string
): ReadonlyArray<MismatchPayload> => {
  const translatedField = translateField(rawFieldName);
  return [
    {
      field: translatedField,
      value: requestValue,
    },
  ];
};

const comparePrimitiveValues = (
  strReq: string,
  strDb: string,
  path: string
): ReadonlyArray<MismatchPayload> => {
  const rawFieldName = path.split(".").pop() || path;

  const normalizedReq = normalizeStringForComparison(strReq);
  const normalizedDb = normalizeStringForComparison(strDb);

  if (
    normalizedReq !== normalizedDb &&
    normalizedReq !== "" &&
    normalizedDb !== ""
  ) {
    return createMismatchPayload(rawFieldName, strReq);
  }

  return [];
};

export const getAnomalies = (
  requestObj: any,
  dbObj: any,
  path = ""
): ReadonlyArray<MismatchPayload> => {
  if (
    (requestObj === undefined || requestObj === null || requestObj === "") &&
    (dbObj === undefined || dbObj === null || dbObj === "")
  ) {
    return [];
  }

  if (
    typeof requestObj === "object" &&
    requestObj !== null &&
    !Array.isArray(requestObj)
  ) {
    const effectiveDbObj = dbObj || {};

    return Object.keys(requestObj).reduce<ReadonlyArray<MismatchPayload>>(
      (acc, key) => {
        if (key.startsWith("no") || key.startsWith("senza")) {
          return acc;
        }

        const newPath = path ? `${path}.${key}` : key;
        const childErrors = getAnomalies(
          requestObj[key],
          effectiveDbObj[key],
          newPath
        );
        return [...acc, ...childErrors];
      },
      []
    );
  }

  const strReq = getTrimmedString(requestObj);
  const strDb = getTrimmedString(dbObj);

  return comparePrimitiveValues(strReq, strDb, path);
};

export const validateFullRequest = (
  originalRequest: any,
  internalRequest: InternalRequestAR002,
  userFromDb: any
): ReadonlyArray<MismatchPayload> => {
  const reqCriteria = internalRequest.criteria;
  const dbUserAny = userFromDb;

  const anagraphicAnomalies: ReadonlyArray<MismatchPayload> =
    ((): ReadonlyArray<MismatchPayload> => {
      if (!reqCriteria || !dbUserAny.subject) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { subjectId, idANPR, ...restCriteria } = reqCriteria;

      const cfErrors = subjectId
        ? getAnomalies(
            subjectId,
            dbUserAny.subject.subjectId || dbUserAny.subject.id,
            "codiceFiscale"
          )
        : [];

      const anprErrors = idANPR
        ? getAnomalies(idANPR, dbUserAny.subject.id, "idANPR")
        : [];

      const otherErrors = getAnomalies(restCriteria, dbUserAny.subject);

      return [...cfErrors, ...anprErrors, ...otherErrors];
    })();

  const reqAny = internalRequest as any;
  const reqCheckRoot = reqAny.check || reqAny.verifica || reqAny;
  const reqAddressRoot = reqCheckRoot?.address || reqCheckRoot?.residenza;

  const reqAddressItalian = reqAddressRoot?.address;
  const reqAddressForeign = reqAddressRoot?.foreignState?.foreignAddress;
  const dbAddressData = dbUserAny.address?.address || dbUserAny.address;

  const addressAnomalies =
    originalRequest.verifica?.residenza?.indirizzo && reqAddressItalian
      ? getAnomalies(reqAddressItalian, dbAddressData, "address")
      : [];

  const dbForeignAddressData =
    dbUserAny.foreignState?.foreignAddress ||
    dbUserAny.address?.foreignAddress ||
    dbUserAny.address;

  const foreignAnomalies =
    originalRequest.verifica?.residenza?.localitaEstera && reqAddressForeign
      ? getAnomalies(reqAddressForeign, dbForeignAddressData, "foreignAddress")
      : [];

  return [...anagraphicAnomalies, ...addressAnomalies, ...foreignAnomalies];
};
