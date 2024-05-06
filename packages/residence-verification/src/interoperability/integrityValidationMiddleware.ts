/* eslint-disable @typescript-eslint/naming-convention */
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling } from "pdnd-models";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { makeApiProblemBuilder } from "pdnd-models";
import { match } from "ts-pattern";
import { logger } from "pdnd-common";
import { ExpressContext, InteroperabilityConfig } from "pdnd-common";
import { generateHashFromString } from "../utilities/hashUtilities.js";
import { validate as tokenValidation } from "./interoperabilityValidationMiddleware.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});

export const integrityValidationMiddleware: () => ZodiosRouterContextRequestHandler<ExpressContext> =
  () => {
    const integrityMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        const config = InteroperabilityConfig.parse(process.env);
        if (config.skipInteroperabilityVerification) {
          return next();
        }
        const signatureToken = Array.isArray(req.headers["agid-jwt-signature"])
          ? req.headers["agid-jwt-signature"][0]
          : req.headers["agid-jwt-signature"];
        if (!signatureToken) {
          logger.error(
            `integrityValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`
          );
          throw ErrorHandling.missingHeader();
        }
        if (!(await tokenValidation(signatureToken, "signatureToken"))) {
          logger.error(`integrityValidationMiddleware - token not valid`);
          throw ErrorHandling.tokenNotValid();
        }
        if (process.env.SKIP_AGID_PAYLOAD_VERIFICATION !== "true") {
          verifyJwtPayload(signatureToken, req);
        }
        logger.info(`[COMPLETED] integrityValidationMiddleware`);
        return next();
      } catch (error) {
        if (error instanceof Object && !("code" in error)) {
          if ("message" in error) {
            logger.error(
              `integrityValidationMiddleware - error not managed with message: ${error.message}`
            );
          }
          return res.status(500).json().end();
        }
        const problem = makeApiProblem(error, (err) =>
          match(err.code)
            .with("unauthorizedError", () => 401)
            .with("operationForbidden", () => 403)
            .with("missingHeader", () => 400)
            .with("missingBearer", () => 401)
            .with("tokenNotValid", () => 401)
            .with("genericBadRequest", () => 400)
            .with("genericError", () => 500)
            .otherwise(() => 500)
        );
        return res.status(problem.status).json(problem).end();
      }
    };

    return integrityMiddleware;
  };

/* eslint-disable */
export const verifyJwtPayload = (jwtToken: string, req: any): void => {
  /* eslint-enable */
  const decodedToken = jwt.decode(jwtToken, { complete: true }) as {
    header: JwtHeader;
    payload: JwtPayload;
  };

  if (!decodedToken.payload) {
    logger.error(`Token not valid`);
    throw ErrorHandling.tokenNotValid();
  }

  const dateNowSeconds = Math.floor(Date.now() / 1000);
  if (
    !decodedToken.payload.exp ||
    !decodedToken.payload.iat ||
    dateNowSeconds > decodedToken.payload.exp ||
    dateNowSeconds < decodedToken.payload.iat
  ) {
    logger.error(`Request Token has expired`);
    throw ErrorHandling.tokenExpired();
  }

  if (
    !decodedToken.payload.aud ||
    decodedToken.payload.aud !== process.env.TOKEN_AUD
  ) {
    logger.error(`Request header aud is incorrect`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!req.headers["content-type"] || !req.headers["content-encoding"]) {
    logger.error(
      `The "content-type" or "content-encoding" value in header is required`
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.signed_headers) {
    logger.error(`The "signed_headers" value in token payload is required`);
    throw ErrorHandling.tokenNotValid();
  }

  const signedHeaders = decodedToken.payload.signed_headers;
  const requiredSignatureHeaders = [
    "content-type",
    "content-encoding",
    "digest",
  ];
  for (const headerName of requiredSignatureHeaders) {
    const signedHeaderExists = signedHeaders.some(
      (header: SignedHeader) => header?.[headerName]
    );
    if (!signedHeaderExists) {
      logger.error(`The '${headerName}' value in token payload is required`);
      throw ErrorHandling.tokenNotValid();
    }
  }

  const signedContentType = signedHeaders.find(
    (header: SignedHeader) => header?.["content-type"]
  );
  if (signedContentType["content-type"] !== req.headers["content-type"]) {
    logger.error(
      `The content-type '${req.headers["content-type"]}' value in request header is different from the value in payload ${signedContentType["content-encoding"]}`
    );
    throw ErrorHandling.tokenNotValid();
  }

  const signedContentEncoding = signedHeaders.find(
    (header: SignedHeader) => header?.["content-encoding"]
  );
  if (
    signedContentEncoding["content-encoding"] !==
    req.headers["content-encoding"]
  ) {
    logger.error(
      `The content-encoding '${req.headers["content-encoding"]}' value in request header is different from the value in payload ${signedContentEncoding["content-encoding"]}`
    );
    throw ErrorHandling.tokenNotValid();
  }

  const signedDigest = signedHeaders.find(
    (header: SignedHeader) => header?.digest
  );
  if (!signedDigest.digest.startsWith("SHA-256")) {
    logger.error(
      `The digest '${signedDigest.digest}' value in token payload is invalid`
    );
    throw ErrorHandling.tokenNotValid();
  }

  const hashBody = generateHashFromString(JSON.stringify(req.body));
  if (hashBody !== signedDigest.digest.substring(8)) {
    logger.error(`Request body digest does not match the signed digest`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!req.headers.digest?.startsWith("SHA-256=")) {
    logger.error(
      `The digest '${req.headers.digest}' value in token payload is  invalid`
    );
    throw ErrorHandling.tokenNotValid();
  }
};

interface SignedHeader {
  [key: string]: string;
}
