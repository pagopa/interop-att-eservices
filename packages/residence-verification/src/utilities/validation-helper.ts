/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MismatchPayload } from "../exceptions/errors.js";
import { InternalRequestAR002 } from "../model/internal-model.js";
import { RES_ENG_TO_ITA_KEYS } from "./residence-mappings.js";

const flattenPaths = (obj: any, prefix = ""): string[] => {
  if (obj === null || obj === undefined) {
    return [];
  }
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return prefix ? [prefix] : [];
  }
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return [];
  }
  return entries.flatMap(([key, value]) =>
    flattenPaths(value, prefix ? `${prefix}.${key}` : key)
  );
};

export const getUnknownRequestFields = (
  request: any,
  mapping: Record<string, string>
): string[] => {
  const validPaths = new Set(Object.keys(mapping));
  return flattenPaths(request).filter((path) => !validPaths.has(path));
};

const BOOLEAN_KEYS = [
  "subject.noSurname",
  "subject.noName",
  "subject.birthDate.noDay",
  "subject.birthDate.noDayMonth",
  "address.address.civicNumber.internalCivic.secondary",
  "address.address.civicNumber.internalCivic.isolated",
];

export const getValueByPath = (obj: any, path: string): any => {
  if (!obj) {
    return undefined;
  }
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

const normalizeString = (val: any): string => {
  if (val === undefined || val === null) {
    return "";
  }
  return String(val)
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9 ]/gu, "")
    .replaceAll(/\s+/gu, " ");
};

const adjustBooleanValue = (key: string, value: any): any => {
  if (BOOLEAN_KEYS.includes(key)) {
    if (value === "false" || value === false || value === "0") {
      return "";
    }
    if (value === "true" || value === true || value === "1") {
      return "true";
    }
  }
  return value;
};

const resolveRoots = (reqAny: any, userFromDb: any): any => {
  const reqCheckRoot = reqAny.check || reqAny.verifica;
  return {
    reqSubject: reqAny.criteria || reqAny.subject,
    dbSubject: userFromDb.subject || userFromDb,
    reqAddress:
      reqCheckRoot?.address || reqCheckRoot?.residenza || reqCheckRoot,
    dbAddress: userFromDb.address || userFromDb,
  };
};

const retrieveValues = (
  fullKey: string,
  roots: any
): { reqVal: any; dbVal: any } | null => {
  if (fullKey.startsWith("subject.")) {
    const path = fullKey.replace("subject.", "");
    return {
      reqVal: getValueByPath(roots.reqSubject, path),
      dbVal: getValueByPath(roots.dbSubject, path),
    };
  }

  if (fullKey.startsWith("address.")) {
    if (!roots.reqAddress || !roots.dbAddress) {
      return null;
    }
    const path = fullKey.replace("address.", "");
    return {
      reqVal: getValueByPath(roots.reqAddress, path),
      dbVal: getValueByPath(roots.dbAddress, path),
    };
  }

  return null;
};

export const validateFullRequest = (
  internalRequest: InternalRequestAR002,
  userFromDbInput: any
): ReadonlyArray<MismatchPayload> => {
  const anomalies: MismatchPayload[] = [];

  const userFromDb = Array.isArray(userFromDbInput)
    ? userFromDbInput[0]
    : userFromDbInput;

  if (!userFromDb) {
    return anomalies;
  }
  const roots = resolveRoots(internalRequest as any, userFromDb);
  for (const [fullKey, labelIta] of Object.entries(RES_ENG_TO_ITA_KEYS)) {
    const rawValues = retrieveValues(fullKey, roots);

    if (!rawValues) {
      continue;
    }

    const cleanReqValue = adjustBooleanValue(fullKey, rawValues.reqVal);

    const normReq = normalizeString(cleanReqValue);
    const normDb = normalizeString(rawValues.dbVal);

    if (normReq !== "" && normReq !== normDb) {
      anomalies.push({
        field: labelIta,
        value: cleanReqValue !== undefined ? String(cleanReqValue).trim() : "",
      });
    }
  }
  return anomalies;
};
