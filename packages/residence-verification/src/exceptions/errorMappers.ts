import { constants } from "http2";
import { ApiError, CommonErrorCodes } from "pdnd-models";
import { match } from "ts-pattern";
import { ErrorCodes as LocalErrorCodes } from "./errors.js";

type ErrorCodes = LocalErrorCodes | CommonErrorCodes;

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_UNAUTHORIZED } =
  constants;

export const createEserviceDataPreparation = (
  error: ApiError<ErrorCodes>
): number =>
  match(error.code)
    .with("eServiceNotFound", () => HTTP_STATUS_BAD_REQUEST)
    .with("userModelNotFound", () => HTTP_STATUS_NOT_FOUND)
    .with("requestParamNotValid", () => HTTP_STATUS_BAD_REQUEST)
    .with("tokenNotValid", () => HTTP_STATUS_UNAUTHORIZED)
    .otherwise(() => HTTP_STATUS_INTERNAL_SERVER_ERROR);
