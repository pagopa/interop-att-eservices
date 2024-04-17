/* eslint-disable @typescript-eslint/naming-convention */
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling } from "pdnd-models";
// import { JWTConfig } from "../index.js";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { makeApiProblemBuilder } from "pdnd-models";
import { match } from "ts-pattern";
import { logger } from "pdnd-common";
import { ExpressContext } from "pdnd-common";
import { validate as tokenValidation } from "./interoperabilityValidationMiddleware.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});

export const integrityValidationMiddleware: () => ZodiosRouterContextRequestHandler<ExpressContext> =
  () => {
    const integrityMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        console.log("[START] integrityValidationMiddleware");
        const signatureToken = Array.isArray(req.headers["agid-jwt-signature"])
          ? req.headers["agid-jwt-signature"][0]
          : req.headers["agid-jwt-signature"];
        if (!signatureToken) {
          logger.error(
            `integrityValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`
          );
          throw ErrorHandling.missingBearer();
        }
        if (!tokenValidation(signatureToken)) {
          logger.error(`integrityValidationMiddleware - token not valid`);
          throw ErrorHandling.tokenNotValid();
        }
        verifyJwtPayload(signatureToken, req);
        console.log("[END] integrityValidationMiddleware");
        return next();
      } catch (error) {
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

export const verifyJwtPayload = (jwtToken: string, req: any): void => {
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
    decodedToken.payload.aud != process.env.TOKEN_AUD
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
      (header: SignedHeader) => header && header[headerName]
    );
    if (!signedHeaderExists) {
      logger.error(`The '${headerName}' value in token payload is required`);
      throw ErrorHandling.tokenNotValid();
    }
  }

  const signedContentType = signedHeaders.find(
    (header: SignedHeader) => header && header["content-type"]
  );
  if (signedContentType["content-type"] !== req.headers["content-type"]) {
    logger.error(
      `The content-type '${req.headers["content-type"]}' value in request header is different from the value in payload ${signedContentType["content-encoding"]}`
    );
    throw ErrorHandling.tokenNotValid();
  }

  const signedContentEncoding = signedHeaders.find(
    (header: SignedHeader) => header && header["content-encoding"]
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
    (header: SignedHeader) => header && header.digest
  );
  if (!signedDigest.digest.startsWith("SHA-256")) {
    logger.error(
      `The digest '${signedDigest.digest}' value in token payload is invalid`
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!req.headers.digest || !req.headers.digest.startsWith("SHA-256")) {
    logger.error(
      `The digest '${req.headers.digest}' value in token payload is invalid`
    );
    throw ErrorHandling.tokenNotValid();
  }
};

interface SignedHeader {
  [key: string]: string;
}
