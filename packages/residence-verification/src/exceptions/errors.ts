import * as http from "http";
import { logger } from "pdnd-common";
import { makeApiProblemBuilder, ApiError, Problem } from "pdnd-models";

export type AnomaliaItem = {
  readonly codiceErroreAnomalia: string;
  readonly tipoErroreAnomalia: string;
  readonly testoErroreAnomalia: string;
  readonly oggettoErroreAnomalia: string;
  readonly campoErroreAnomalia: string;
  readonly valoreErroreAnomalia: string;
};

export type ResidenceErrorResponse = {
  readonly idOperazioneANPR: string;
  // eslint-disable-next-line @typescript-eslint/array-type
  readonly listaErrori: ReadonlyArray<AnomaliaItem>;
};

const errorCodes = {
  eServiceNotFound: "0001",
  userModelNotFound: "0002",
  requestParamNotValid: "0003",
  unknownRequestField: "0004",
};

export type ErrorCodes = keyof typeof errorCodes;

/* eslint-disable */
export const makeApiProblem: any = makeApiProblemBuilder(logger, errorCodes);
/* eslint-enable */

export function eServiceNotFound(eserviceId: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: `EService ${eserviceId} not found`,
    code: "eServiceNotFound",
    title: "EService not found",
  });
}

export function userModelNotFound(details?: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: details != null ? details : "Data not found",
    code: "userModelNotFound",
    title: "Not found",
  });
}

export function requestParamNotValid(details: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: details,
    code: "requestParamNotValid",
    title: "Request param not valid",
  });
}

export function unknownRequestField(fields: string[]): ApiError<ErrorCodes> {
  const fieldList = fields.map((f) => `'${f}'`).join(", ");
  return new ApiError({
    detail: `I seguenti campi non sono riconosciuti e la richiesta non può essere elaborata: ${fieldList}`,
    code: "unknownRequestField",
    title: "Campo non riconosciuto",
  });
}

export type MismatchPayload = {
  readonly field: string;
  readonly value: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapGeneralErrorModel(
  idOperazione: string,
  problem: Problem
): any {
  const status = problem.status;
  const statusText = http.STATUS_CODES[status] || "Unknown Error";

  const parseAnomalies = (
    detail: string
  ): ReadonlyArray<MismatchPayload> | null => {
    try {
      const parsed = JSON.parse(detail);
      if (Array.isArray(parsed) && parsed.length > 0 && "field" in parsed[0]) {
        return parsed as ReadonlyArray<MismatchPayload>;
      }
      return null;
    } catch {
      return null;
    }
  };

  const anomalies = parseAnomalies(problem.detail);
  // eslint-disable-next-line @typescript-eslint/array-type
  const listaErrori: ReadonlyArray<AnomaliaItem> = anomalies
    ? anomalies.map((a) => ({
        codiceErroreAnomalia: "0003",
        tipoErroreAnomalia: String(status),
        testoErroreAnomalia: a.value,
        oggettoErroreAnomalia: statusText,
        campoErroreAnomalia: a.field,
        valoreErroreAnomalia: "",
      }))
    : [
        {
          codiceErroreAnomalia:
            problem.errors && problem.errors.length > 0
              ? problem.errors[0].code
              : "GENERIC",
          tipoErroreAnomalia: String(status),
          testoErroreAnomalia: problem.detail || "Errore generico",
          oggettoErroreAnomalia: statusText,
          campoErroreAnomalia: "",
          valoreErroreAnomalia: "",
        },
      ];

  const response: ResidenceErrorResponse = {
    idOperazioneANPR: idOperazione,
    listaErrori,
  };

  return response;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
