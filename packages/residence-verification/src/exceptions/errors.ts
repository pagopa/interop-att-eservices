import { logger } from "pdnd-common";
import { makeApiProblemBuilder, ApiError } from "pdnd-models";

const errorCodes = {
  eServiceNotFound: "0001",
  userModelNotFound: "0002",
  requestParamNotValid: "0003",
};

export type ErrorCodes = keyof typeof errorCodes;

export const makeApiProblem: any = makeApiProblemBuilder(logger, errorCodes);

export function eServiceNotFound(eserviceId: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: `EService ${eserviceId} not found`,
    code: "eServiceNotFound",
    title: "EService not found",
  });
}

export function userModelNotFound(details: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: details,
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
