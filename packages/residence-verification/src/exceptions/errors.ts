import * as http from "http";
import { logger } from "pdnd-common";
import { makeApiProblemBuilder, ApiError, Problem } from "pdnd-models";

export type ErrorModel = {
  codiceErroreAnomalia: string;
  tipoErroreAnomalia: number;
  oggettoErroreAnomalia?: string;
  testoErroreAnomalia: string;
  campoErroreAnomalia?: string;
  valoreErroreAnomalia?: string;
};

export type GeneralErrorModel = {
  idOperazione: string;
  errors: ErrorModel[];
};

const errorCodes = {
  eServiceNotFound: "0001",
  userModelNotFound: "0002",
  requestParamNotValid: "0003",
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

 /* eslint-disable */
export function mapGeneralErrorModel(
  idOperazione: string,
  error: Problem
): any {
  const errorsModel: ErrorModel[] = error.errors.map((problemError) => ({
    codiceErroreAnomalia: problemError.code,
    tipoErroreAnomalia: error.status,
    oggettoErroreAnomalia: http.STATUS_CODES[error.status],
    testoErroreAnomalia: problemError.detail,
    campoErroreAnomalia: undefined,
    valoreErroreAnomalia: undefined,
  }));

  const data: GeneralErrorModel = {
    idOperazione,
    errors: errorsModel,
  };

  return data;
}
/* eslint-enable */