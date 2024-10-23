import { constants } from "http2";
import { ApiError, CommonErrorCodes } from "pdnd-models";
import { match } from "ts-pattern";
import { ErrorCodes as LocalErrorCodes } from "./errors.js";

type ErrorCodes = LocalErrorCodes | CommonErrorCodes;

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST } =
  constants;

export const createEserviceDataPreparation = (
  error: ApiError<ErrorCodes>
): number =>
  match(error.code)
    .with("eServiceNotFound", () => HTTP_STATUS_BAD_REQUEST)
    .with("requestParamNotValid", () => HTTP_STATUS_BAD_REQUEST)
    .otherwise(() => HTTP_STATUS_INTERNAL_SERVER_ERROR);
