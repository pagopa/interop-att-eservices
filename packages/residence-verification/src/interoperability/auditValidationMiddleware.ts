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

export const auditValidationMiddleware: () => ZodiosRouterContextRequestHandler<ExpressContext> =
  () => {
    const auditMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        const trackingEvidenceToken = Array.isArray(
          req.headers["agid-jwt-trackingevidence"]
        )
          ? req.headers["agid-jwt-trackingevidence"][0]
          : req.headers["agid-jwt-trackingevidence"];
        if (!trackingEvidenceToken) {
          logger.error(`auditValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`);
          throw ErrorHandling.missingHeader();
        }
        if (! await tokenValidation(trackingEvidenceToken)) {
          logger.error(`auditValidationMiddleware - token not valid`);
          throw ErrorHandling.tokenNotValid();
        }
        
        if ( process.env.SKIP_AGID_PAYLOAD_VERIFICATION != 'true' ) {
          verifyJwtPayload(trackingEvidenceToken);
        }
        logger.info(`[COMPLETED] auditValidationMiddleware`);
        return next();
      } catch (error) {
        if (error instanceof Object && !('code' in error)) {
          if ('message' in error) logger.error(`auditValidationMiddleware - error not managed with message: ${error.message}`);
          return res.status(500).json().end();
        }
        const problem = makeApiProblem(error, (err) =>
          match(err.code)
            .with("unauthorizedError", () => 401)
            .with("operationForbidden", () => 403)
            .with("missingHeader", () => 400)
            .otherwise(() => 500)
        );
        return res.status(problem.status).json(problem).end();
      }
    };

    return auditMiddleware;
  };

const verifyJwtPayload = (jwtToken: string): void => {
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
    logger.error(`Request header 'aud' is incorrect`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.iss) {
    logger.error(`Request header 'iss' not present`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.purposeId) {
    logger.error(`Request header 'purposeId' not present`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.userID) {
    logger.error(`Request header 'purposeId' not present`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.userLocation) {
    logger.error(`Request header 'purposeId' not present`);
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.LoA) {
    logger.error(`Request header 'purposeId' not present`);
    throw ErrorHandling.tokenNotValid();
  }
};
