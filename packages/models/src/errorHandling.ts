import { P, match } from "ts-pattern";
import { ApiError } from "./error/apiError.js";

export type ProblemError = {
  code: string;
  detail: string;
};

export type Problem = {
  type: string;
  status: number;
  title: string;
  correlationId?: string;
  detail: string;
  errors: ProblemError[];
  toString: () => string;
};

const errorCodes = {
  genericError: "9000",
  genericBadRequest: "9001",
  unauthorizedError: "9002",
  operationForbidden: "9003",
  tokenNotValid: "9021",
  missingHeader: "9022",
  missingClaims: "9023",
  missingBearer: "9024",
  tokenGenerationError: "9995",
  thirdPartyCallError: "9992",
  genericInternalError: "9991",
} as const;

export type CommonErrorCodes = keyof typeof errorCodes;

export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return `${JSON.stringify(error)}`;
}

export function makeApiProblemBuilder<T extends string>(
  logger: { error: (message: string) => void },
  errors: {
    [K in T]: string;
  }
): (
  error: unknown,
  httpMapper: (apiError: ApiError<T | CommonErrorCodes>) => number
) => Problem {
  const allErrors = { ...errorCodes, ...errors };
  return (error, httpMapper) => {
    const makeProblem = (
      httpStatus: number,
      { code, title, detail, correlationId }: ApiError<T | CommonErrorCodes>
    ): Problem => ({
      type: "about:blank",
      title,
      status: httpStatus,
      detail,
      correlationId,
      errors: [
        {
          code: allErrors[code],
          detail,
        },
      ],
    });
    const problem = match<unknown, Problem>(error)
      .with(P.instanceOf(ApiError<T | CommonErrorCodes>), (error) =>
        makeProblem(httpMapper(error), error)
      )
      .otherwise(() =>
        makeProblem(
          500,
          new ApiError({
            code: "genericError",
            title: "Generic Error",
            detail: "generic error",
          })
        )
      );
    logger.error(
      `- ${problem.title} - ${problem.detail} - orignal error: ${error}`
    );
    return problem;
  };
}

export class ErrorHandling {
  public static genericError(details?: string): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "genericError",
      title: "Generic Error",
      detail: details ?? "generic error",
    });
  }

  public static tokenNotValid(message?: string): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "tokenNotValid",
      title: "Token Not Valid",
      detail: message ?? "Request Token is not valid",
    });
  }

  public static tokenExpired(): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "tokenNotValid",
      title: "Token Expired",
      detail: "Request has expired",
    });
  }

  public static invalidApiRequest(name?: string): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "genericBadRequest",
      title: "Request body not valid",
      detail: name
        ? `Attribute '${name}' not valid in body request`
        : "Body not valid",
    });
  }

  public static missingBearer(): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "missingBearer",
      title: "Bearer token has not been passed",
      detail: `Authorization bearer token has not been passed`,
    });
  }

  public static missingHeader(headerName?: string): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "missingHeader",
      title: "Missing header",
      detail: headerName
        ? `Header ${headerName} not existing in this request`
        : "Missing header",
    });
  }

  public static missingClaim(details: string): ApiError<CommonErrorCodes> {
    return new ApiError({
      detail: details,
      code: "missingClaims",
      title: "Claim has not been passed",
    });
  }

  public static tokenGenerationError(
    error: unknown
  ): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "tokenGenerationError",
      detail: `Error during token generation: ${parseErrorMessage(error)}`,
      title: "Error token generated",
    });
  }

  public static thirdPartyCallError(
    serviceName: string,
    errorMessage: string
  ): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "thirdPartyCallError",
      detail: `Error while invoking ${serviceName} external service -> ${errorMessage}`,
      title: "Error token generated",
    });
  }

  public static genericInternalError(
    message: string
  ): ApiError<CommonErrorCodes> {
    return new ApiError({
      code: "genericInternalError",
      detail: message,
      title: "Error token generated",
    });
  }
}
