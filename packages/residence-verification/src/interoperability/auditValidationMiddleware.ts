/* eslint-disable @typescript-eslint/naming-convention */
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling } from "pdnd-models";
// import { JWTConfig } from "../index.js";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import { makeApiProblemBuilder } from "pdnd-models";
import { match } from "ts-pattern";
import { logger, InteroperabilityConfig } from "pdnd-common";
import { ExpressContext } from "pdnd-common";
import { TrialService } from "trial";
import { validate as tokenValidation } from "./interoperabilityValidationMiddleware.js";
const makeApiProblem = makeApiProblemBuilder(logger, {});

export const auditValidationMiddleware: () => ZodiosRouterContextRequestHandler<ExpressContext> =
  () => {
    const auditMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        const config = InteroperabilityConfig.parse(process.env);
        if (config.skipInteroperabilityVerification) {
          return next();
        }
        if (
          req.headers["agid-jwt-trackingevidence"] === null ||
          req.headers["agid-jwt-trackingevidence"] === undefined
        ) {
          logger.error(
            `auditValidationMiddleware - No matching headers found: agid-jwt-trackingevidence`
          );
          void TrialService.insert(
            req.url,
            req.method,
            "TRACKING_EVIDENCE_NOT_PRESENT"
          );
          throw ErrorHandling.missingHeader("Header attribute not found");
        }
        const trackingEvidenceToken = Array.isArray(
          req.headers["agid-jwt-trackingevidence"]
        )
          ? req.headers["agid-jwt-trackingevidence"][0]
          : req.headers["agid-jwt-trackingevidence"];
        if (!trackingEvidenceToken) {
          logger.error(
            `auditValidationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`
          );
          void TrialService.insert(
            req.url,
            req.method,
            "TRACKING_EVIDENCE_NOT_VALID"
          );
          throw ErrorHandling.missingHeader();
        }
        if (
          !(await tokenValidation(
            trackingEvidenceToken,
            "trackingEvidenceToken"
          ))
        ) {
          logger.error(`auditValidationMiddleware - token not valid`);
          void TrialService.insert(
            req.url,
            req.method,
            "TRACKING_EVIDENCE_PUBLIC_KEY_NOT_VALID"
          );
          throw ErrorHandling.tokenNotValid();
        }
        /* eslint-disable */
        if (process.env.SKIP_AGID_PAYLOAD_VERIFICATION != "true") {
          verifyJwtPayload(trackingEvidenceToken, req.url, req.method);
        }
        /* eslint-enable */
        void TrialService.insert(
          req.url,
          req.method,
          "TRACKING_EVIDENCE",
          "OK"
        );
        logger.info(`[COMPLETED] auditValidationMiddleware`);
        return next();
      } catch (error) {
        if (error instanceof Object && !("code" in error)) {
          if ("message" in error) {
            logger.error(
              `auditValidationMiddleware - error not managed with message: ${error.message}`
            );
          }
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

const verifyJwtPayload = (
  jwtToken: string,
  url: string,
  method: string
): void => {
  const decodedToken = jwt.decode(jwtToken, { complete: true }) as {
    header: JwtHeader;
    payload: JwtPayload;
  };

  if (!decodedToken.payload) {
    logger.error(`verifyJwtPayload - Token not valid`);
    void TrialService.insert(
      url,
      method,
      "TRACKING_EVIDENCE_PAYLOAD_NOT_PRESENT"
    );
    throw ErrorHandling.tokenNotValid();
  }

  const dateNowSeconds = Math.floor(Date.now() / 1000);
  if (!decodedToken.payload.exp) {
    logger.error(`verifyJwtPayload - "exp" in payload is required`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_EXP_NOT_PRESENT");
    throw ErrorHandling.tokenNotValid();
  }
  if (dateNowSeconds > decodedToken.payload.exp) {
    logger.error(`verifyJwtPayload - Request Token has expired`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_EXP_NOT_VALID");
    throw ErrorHandling.tokenExpired();
  }

  if (!decodedToken.payload.iat) {
    logger.error(`verifyJwtPayload - "iat" in payload is required`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_IAT_NOT_PRESENT");
    throw ErrorHandling.tokenNotValid();
  }
  if (dateNowSeconds < decodedToken.payload.iat) {
    logger.error(`verifyJwtPayload - Request Token has an invalid issue time`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_IAT_NOT_VALID");
    throw ErrorHandling.tokenExpired();
  }

  if (!decodedToken.payload.aud) {
    logger.error(`verifyJwtPayload - "aud" in payload is required`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_AUD_NOT_PRESENT");
    throw ErrorHandling.tokenNotValid();
  }
  if (decodedToken.payload.aud !== process.env.TOKEN_AUD) {
    logger.error(`verifyJwtPayload - Request header 'aud' is not valid`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_AUD_NOT_VALID");
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.iss) {
    logger.error(`verifyJwtPayload - Request header 'iss' not present`);
    void TrialService.insert(url, method, "TRACKING_EVIDENCE_ISS_NOT_PRESENT");
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.purposeId) {
    logger.error(`verifyJwtPayload - Request header 'purposeId' not present`);
    void TrialService.insert(
      url,
      method,
      "TRACKING_EVIDENCE_PURPOSE_ID_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.userID) {
    logger.error(`verifyJwtPayload - Request header 'purposeId' not present`);
    void TrialService.insert(
      url,
      method,
      "TRACKING_EVIDENCE_USER_ID_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.userLocation) {
    logger.error(`verifyJwtPayload - Request header 'purposeId' not present`);
    void TrialService.insert(
      url,
      method,
      "TRACKING_EVIDENCE_USER_LOCATION_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }

  if (!decodedToken.payload.LoA) {
    logger.error(`verifyJwtPayload - Request header 'purposeId' not present`);
    void TrialService.insert(
      url,
      method,
      "TRACKING_EVIDENCE_USER_LOA_NOT_VALID"
    );
    throw ErrorHandling.tokenNotValid();
  }
};
