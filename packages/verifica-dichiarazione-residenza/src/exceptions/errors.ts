import { logger } from "pdnd-common";
import { makeApiProblemBuilder, ApiError } from "pdnd-model";

const errorCodes = {
  eServiceNotFound: "0001",
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
