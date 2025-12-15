import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { makeApiProblemBuilder, ErrorHandling } from "pdnd-models";
import { match } from "ts-pattern";
import { Request } from "express";
import { ExpressContext } from "../../index.js";
import { InteroperabilityConfig } from "../../config/interoperabilityConfig.js";
import { logger } from "../../logging/index.js";
import {
  generateHashFromString,
  encodeBase64,
} from "../../utility/hashUtility.js";
import { TrialService } from "../../services/trial-api/trialService.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});

export const integrityValidationMiddleware: (
  config: InteroperabilityConfig
) => ZodiosRouterContextRequestHandler<ExpressContext> = (config) => {
  const integrityMiddleware: ZodiosRouterContextRequestHandler<
    ExpressContext
  > = async (req, res, next): Promise<unknown> => {
    try {
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
        void TrialService.insert(req.url, req.method, "SIGNATURE_NOT_PRESENT");
        throw ErrorHandling.missingHeader("agid-jwt-signature");
      }
      const signatureToken = Array.isArray(req.headers["agid-jwt-signature"])
        ? req.headers["agid-jwt-signature"][0]
        : req.headers["agid-jwt-signature"];
      if (!signatureToken) {
        logger.error(
          `integrityValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`
        );
        void TrialService.insert(req.url, req.method, "SIGNATURE_NOT_VALID");
        throw ErrorHandling.missingHeader("agid-jwt-signature");
      }

      if (config.skipAgidPayloadVerification !== true) {
        verifyJwtPayload(signatureToken, req, config);
      }

      void TrialService.insert(req.url, req.method, "SIGNATURE", "OK");
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

export const verifyJwtPayload = (
  jwtToken: string,
  req: Request,
  config: InteroperabilityConfig
): void => {
  const decodedToken = jwt.decode(jwtToken, { complete: true }) as {
    header: JwtHeader;
    payload: JwtPayload;
  };

  const payload = decodedToken.payload;

  verifyPayloadExists(payload, req);

  verifyTemporalClaims(payload, req);

  verifyAudience(payload, req, config.tokenAud);

  verifySignedHeaders(payload, req);

  verifyDigest(payload, req);
};

export const checkValueTrial = (
  operationPath: string,
  operationMethod: string,
  signedHeaderName: string
): void => {
  if (signedHeaderName === "content-type") {
    void TrialService.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_SIGNED_CONTENT_TYPE_NOT_PRESENT"
    );
  } else if (signedHeaderName === "content-encoding") {
    void TrialService.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_CONTENT_ENCODING_NOT_PRESENT"
    );
  } else {
    void TrialService.insert(
      operationPath,
      operationMethod,
      "SIGNATURE_SIGNED_DIGEST_NOT_PRESENT"
    );
  }
};

const verifyPayloadExists = (
  payload: JwtPayload | undefined,
  req: Request
): void => {
  if (!payload) {
    logger.error(`verifyJwtPayload - Token not valid`);
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_PAYLOAD_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }
};

const verifyTemporalClaims = (payload: JwtPayload, req: Request): void => {
  const dateNowSeconds = Math.floor(Date.now() / 1000);

  if (!payload.exp || dateNowSeconds > payload.exp) {
    logger.error(
      `verifyJwtPayload - "exp" claim is missing or token has expired`
    );
    void TrialService.insert(req.url, req.method, "SIGNATURE_EXP_INVALID");
    throw ErrorHandling.tokenExpired();
  }

  if (!payload.iat || dateNowSeconds < payload.iat) {
    logger.error(`verifyJwtPayload - "iat" claim is missing or invalid`);
    void TrialService.insert(req.url, req.method, "SIGNATURE_IAT_INVALID");
    throw ErrorHandling.tokenNotValid();
  }
};

const verifyAudience = (
  payload: JwtPayload,
  req: Request,
  expectedAudience: string
): void => {
  if (!payload.aud || payload.aud !== expectedAudience) {
    logger.error(`verifyJwtPayload - "aud" claim is missing or not valid`);
    void TrialService.insert(req.url, req.method, "SIGNATURE_AUD_NOT_VALID");
    throw ErrorHandling.tokenNotValid();
  }
};

const verifySignedHeaders = (payload: JwtPayload, req: Request): void => {
  if (!req.headers["content-type"] || !req.headers["content-encoding"]) {
    logger.error(
      `verifyJwtPayload - Missing "content-type" or "content-encoding" in request headers`
    );
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_HEADER_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const { signed_headers: signedHeaders } = payload;
  if (typeof signedHeaders !== "object" || !signedHeaders) {
    logger.error(
      `verifyJwtPayload - "signed_headers" in token payload must be a non-null object`
    );
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_HEADERS_INVALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const requiredHeaders = ["content-type", "content-encoding", "digest"];
  for (const header of requiredHeaders) {
    if (!signedHeaders[header]) {
      logger.error(
        `verifyJwtPayload - The '${header}' is required in signed_headers`
      );
      checkValueTrial(req.url, req.method, header);
      throw ErrorHandling.tokenNotValid();
    }
  }

  if (
    signedHeaders["content-type"] !== req.headers["content-type"] ||
    signedHeaders["content-encoding"] !== req.headers["content-encoding"]
  ) {
    logger.error(
      `verifyJwtPayload - Signed headers do not match request headers`
    );
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_HEADERS_NOT_MATCH"
    );
    throw ErrorHandling.tokenNotValid();
  }
};

const verifyDigest = (payload: JwtPayload, req: Request): void => {
  const { signed_headers: signedHeaders } = payload;

  if (!signedHeaders?.digest || !signedHeaders.digest.startsWith("SHA-256")) {
    logger.error(`verifyJwtPayload - The digest in token payload is invalid`);
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_SIGNED_DIGEST_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const bodyAsString = req.rawBody
    ? JSON.stringify(JSON.parse(req.rawBody ?? ""))
    : JSON.stringify(req.body);

  logger.info(`req.rawBody : ${req.rawBody}`);

  const hashBody = encodeBase64(generateHashFromString(bodyAsString));
  if (hashBody !== signedHeaders.digest.substring(8)) {
    logger.error(
      `verifyJwtPayload - Request body digest does not match the signed digest`
    );
    void TrialService.insert(
      req.url,
      req.method,
      "SIGNATURE_DIGEST_BODY_NOT_MATCH_SIGNED_DIGEST"
    );
    throw ErrorHandling.tokenNotValid();
  }
};
