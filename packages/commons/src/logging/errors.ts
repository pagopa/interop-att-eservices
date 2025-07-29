import { ApiError } from "pdnd-models";

const errorCodes = {
  eServiceNotFound: "0001",
  certNotValid: "0002",
  requestParamNotValid: "0003",
  operationIdNotFound: "0004",
  operationIdNotValid: "0005",
  userModelNotFound: "0006",
};

export type ErrorCodes = keyof typeof errorCodes;

export function certNotValidError(details?: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: details != null ? details : "Certificate not valid",
    code: "certNotValid",
    title: "not valid",
  });
}

export function userModelNotFound(details?: string): ApiError<ErrorCodes> {
  return new ApiError({
    detail: details != null ? details : "Data not found",
    code: "userModelNotFound",
    title: "Not found",
  });
}
