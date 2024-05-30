/* eslint-disable @typescript-eslint/naming-convention */
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling } from "pdnd-models";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { makeApiProblemBuilder } from "pdnd-models";
import { match } from "ts-pattern";
import { logger } from "pdnd-common";
import { ExpressContext, InteroperabilityConfig } from "pdnd-common";
import { TrialRepository } from "trial";
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
        if (
          req.headers["agid-jwt-signature"] === null ||
          req.headers["agid-jwt-signature"] === undefined
        ) {
          logger.error(
            `integrityValidationMiddleware - No matching headers found: agid-jwt-signature`
          );
          void TrialRepository.insert(
            req.url,
            req.method,
            "SIGNATURE_NOT_PRESENT"
          );
          throw ErrorHandling.missingHeader("Header attribute not found");
        }
        const signatureToken = Array.isArray(req.headers["agid-jwt-signature"])
          ? req.headers["agid-jwt-signature"][0]
          : req.headers["agid-jwt-signature"];
        if (!signatureToken) {
          logger.error(
            `integrityValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`
          );
          void TrialRepository.insert(
            req.url,
            req.method,
            "SIGNATURE_NOT_VALID"
          );
          throw ErrorHandling.missingHeader();
        }
        if (!(await tokenValidation(signatureToken, "signatureToken"))) {
          logger.error(`integrityValidationMiddleware - token not valid`);
          void TrialRepository.insert(
            req.url,
            req.method,
            "SIGNATURE_PUBLIC_KEY_NOT_VALID"
          );
          throw ErrorHandling.tokenNotValid();
        }
        if (process.env.SKIP_AGID_PAYLOAD_VERIFICATION !== "true") {
          verifyJwtPayload(signatureToken, req);
        }

        void TrialRepository.insert(req.url, req.method, "SIGNATURE", "OK");
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
    logger.error(`verifyJwtPayload - Token not valid`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_PAYLOAD_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const dateNowSeconds = Math.floor(Date.now() / 1000);
  if (!decodedToken.payload.exp) {
    logger.error(`verifyJwtPayload - "exp" in payload is required`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_EXP_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
  if (dateNowSeconds > decodedToken.payload.exp) {
    logger.error(`verifyJwtPayload - Request Token has expired`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_EXP_IS_EXPIRED"
    );
    throw ErrorHandling.tokenExpired();
  }

  if (!decodedToken.payload.iat) {
    logger.error(`verifyJwtPayload - "iat" in payload is required`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_IAT_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
  if (dateNowSeconds < decodedToken.payload.iat) {
    logger.error(`verifyJwtPayload - Request Token has an invalid issue time`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_IAT_IS_EXPIRED"
    );
    throw ErrorHandling.tokenExpired();
  }

  if (!decodedToken.payload.aud) {
    logger.error(`verifyJwtPayload - "aud" in payload is required`);
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_AUD_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
  if (decodedToken.payload.aud !== process.env.TOKEN_AUD) {
    logger.error(`verifyJwtPayload - Request header aud is not valid`);
    void TrialRepository.insert(req.url, req.method, "SIGNATURE_AUD_NOT_VALID");
    throw ErrorHandling.tokenNotValid();
  }

  if (!req.headers["content-type"]) {
    logger.error(
      `verifyJwtPayload - "content-type" value in header is required`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_CONTENT_TYPE_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
  if (!req.headers["content-encoding"]) {
    logger.error(
      `verifyJwtPayload - "content-encoding" value in header is required`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_CONTENT_ENCODING_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
  if (!decodedToken.payload.signed_headers) {
    logger.error(
      `verifyJwtPayload - "signed_headers" value in token payload is required`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_NOT_PRESENT"
    );
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
      logger.error(
        `verifyJwtPayload - The '${headerName}' value in token payload is required`
      );
      checkValueTrial(req.url, req.method, headerName);
      throw ErrorHandling.tokenNotValid();
    }
  }

  const signedContentType = signedHeaders.find(
    (header: SignedHeader) => header?.["content-type"]
  );
  if (signedContentType["content-type"] !== req.headers["content-type"]) {
    logger.error(
      `verifyJwtPayload - The content-type '${req.headers["content-type"]}' value in request header is different from the value in payload ${signedContentType["content-encoding"]}`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_CONTENT_TYPE_NOT_MATCH"
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
      `verifyJwtPayload - The content-encoding '${req.headers["content-encoding"]}' value in request header is different from the value in payload ${signedContentEncoding["content-encoding"]}`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_CONTENT_ENCODING_NOT_MATCH"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const signedDigest = signedHeaders.find(
    (header: SignedHeader) => header?.["content-encoding"]
  );
  if (!signedDigest.digest.startsWith("SHA-256")) {
    logger.error(
      `verifyJwtPayload - The digest '${signedDigest.digest}' value in token payload is invalid`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_DIGEST_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!req.headers.digest?.startsWith("SHA-256=")) {
    logger.error(
      `verifyJwtPayload - The digest '${req.headers.digest}' value in token payload is  invalid`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_DIGEST_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (signedDigest.digest !== req.headers.digest) {
    logger.error(
      `verifyJwtPayload - The digest '${req.headers.digest}' value in request header is different from the value in payload ${signedDigest.digest}`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_DIGEST_NOT_MATCH_SIGNED_DIGEST"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const hashBody = generateHashFromString(JSON.stringify(req.body));
  if (hashBody !== signedDigest.digest.substring(8)) {
    logger.error(
      `verifyJwtPayload - Request body digest does not match the signed digest`
    );
    void TrialRepository.insert(
      req.url,
      req.method,
      "SIGNATURE_DIGEST_BODY_NOT_MATCH_SIGNED_DIGEST"
    );
    throw ErrorHandling.tokenNotValid();
  }
};

export const checkValueTrial = (
  operationPath: string,
  operationMethod: string,
  signedHeaderName: string
): void => {
  // Aggiunto export
  if (signedHeaderName === "content-type") {
    void TrialRepository.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_SIGNED_CONTENT_TYPE_NOT_PRESENT"
    );
  } else if (signedHeaderName === "content-encoding") {
    void TrialRepository.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_CONTENT_ENCODING_NOT_PRESENT"
    );
  } else {
    void TrialRepository.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_SIGNED_DIGEST_NOT_PRESENT"
    );
  }
};

interface SignedHeader {
  [key: string]: string;
}
