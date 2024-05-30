import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling, makeApiProblemBuilder } from "pdnd-models";
import { P, match } from "ts-pattern";
import { ExpressContext, sendCustomEvent } from "../index.js";
import { logger } from "../logging/index.js";
import { AuthData } from "./authData.js";
import { Headers } from "./headers.js";
import {
  readAuthDataFromJwtToken,
  verifyJwtPayloadAndHeader,
  verifyJwtToken,
} from "./jwt.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});
/* eslint-disable */
export const authenticationMiddleware: (isEnableTrial: boolean) => ZodiosRouterContextRequestHandler<ExpressContext> =
  (isEnableTrial) => {
    const authMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        const addCtxAuthData = async (
          authHeader: string,
          correlationId: string
        ): Promise<void> => {
          const authorizationHeader = authHeader.split(" ");
          if (authorizationHeader.length !== 2 || authorizationHeader[0] !== "Bearer") {
            logger.error(`authenticationMiddleware - No authentication has been provided for this call ${req.method} ${req.url}`);
            throw ErrorHandling.missingBearer();
          }

          const jwtToken = authorizationHeader[1];

          const valid = await verifyJwtToken(jwtToken);
          if (!valid) {
            logger.error(`authenticationMiddleware - The jwt token is not valid`);
            throw ErrorHandling.tokenNotValid("Authorizzation bearer token is not valid");
          }
          logger.info(`authenticationMiddleware - Bearer Token: isValid: ${valid}`);

          const authData = readAuthDataFromJwtToken(jwtToken);
          match(authData)
            .with(P.instanceOf(Error), (err) => {
              logger.warn(`authenticationMiddleware - Invalid authentication provided: ${err.message}`);
              if (isEnableTrial) {
                sendCustomEvent('trialEvent', { operationPath: req.url, checkName: "VOUCHER_AUTH_DATA_CANNOT_BE_PARSED" });
              }
              throw ErrorHandling.genericError("Invalid claims");
            })
            .otherwise((claimsRes: AuthData) => {
             /* eslint-disable */
              req.ctx = {
                authData: { ...claimsRes },
                correlationId,
              };
              /* eslint-enable */
          });

        const validPayloadAndHeader = await verifyJwtPayloadAndHeader(
          jwtToken,
          req.path,
          req.method,
          isEnableTrial
        );
        if (!validPayloadAndHeader) {
          logger.error(
            `authenticationMiddleware - The jwt bearer token header or payload is not valid`
          );
          throw ErrorHandling.genericError("The jwt bearer token not valid");
        }

        if (isEnableTrial) {
          sendCustomEvent("trialEvent", {
            operationPath: req.url,
            operationMethod: req.method,
            checkName: "VOUCHER",
            response: "OK",
          });
        }
        return next();
      };
      const headers = Headers.safeParse(req.headers);
      if (!headers.success) {
        throw ErrorHandling.missingClaim("Invalid claims");
      }

      return await match(headers.data)
        .with(
          {
            authorization: P.string,
            "x-correlation-id": P.string,
          },
          async (headers) => {
            logger.info(
              `authenticationMiddleware - Matching headers with authorization, correlation ID`
            );
            await addCtxAuthData(
              headers.authorization,
              headers["x-correlation-id"]
            );
          }
        )
        .otherwise(() => {
          logger.info(`authenticationMiddleware - No matching headers found`);
          if (
            headers.data["x-correlation-id"] === null ||
            headers.data["x-correlation-id"] === undefined
          ) {
            logger.error(
              `authenticationMiddleware - No matching headers found: x-correlation-id`
            );
            throw ErrorHandling.missingHeader("x-correlation-id");
          } else {
            throw ErrorHandling.missingBearer();
          }
        });
    } catch (error) {
      if (error instanceof Object && !("code" in error)) {
        if ("message" in error) {
          logger.error(
            `authenticationMiddleware - error not managed with message: ${error.message}`
          );
        }
        return res.status(500).json().end();
      }
      const problem = makeApiProblem(error, (err) =>
        match(err.code)
          .with("unauthorizedError", () => 401)
          .with("operationForbidden", () => 403)
          .with("missingHeader", () => 400)
          .with("genericError", () => 400)
          .with("tokenNotValid", () => 401)
          .otherwise(() => 500)
      );
      return res.status(problem.status).json(problem).end();
    }
  };

  return authMiddleware;
};
/* eslint-enable */
