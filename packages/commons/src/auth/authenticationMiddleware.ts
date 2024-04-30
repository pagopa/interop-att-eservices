import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling, makeApiProblemBuilder } from "pdnd-models";
import { P, match } from "ts-pattern";
import { ExpressContext } from "../index.js";
import { logger } from "../logging/index.js";
import { AuthData } from "./authData.js";
import { Headers } from "./headers.js";
import {
  readAuthDataFromJwtToken,
  verifyJwtPayloadAndHeader,
  verifyJwtToken,
} from "./jwt.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});

export const authenticationMiddleware: () => ZodiosRouterContextRequestHandler<ExpressContext> =
  () => {
    const authMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        const addCtxAuthData = async (
          authHeader: string,
          correlationId: string
        ): Promise<void> => {
          const authorizationHeader = authHeader.split(" ");
          if (
            authorizationHeader.length !== 2 ||
            authorizationHeader[0] !== "Bearer"
          ) {
            logger.warn(
              `No authentication has been provided for this call ${req.method} ${req.url}`
            );
            throw ErrorHandling.missingBearer();
          }
  
          const jwtToken = authorizationHeader[1];
  
          const validPayloadAndHeader = await verifyJwtPayloadAndHeader(jwtToken);
          if (!validPayloadAndHeader) {
            logger.warn(`The jwt token header or payload is not valid`);
            throw ErrorHandling.genericError(
              "The jwt token header or payload is not valid"
            );
          }
  
          const valid = await verifyJwtToken(jwtToken);
          if (!valid) {
            logger.warn(`The jwt token is not valid`);
            throw ErrorHandling.tokenNotValid();
          }
          logger.info(`Bearer Token: isValid: ${valid}`);
  
          const authData = readAuthDataFromJwtToken(jwtToken);
          match(authData)
            .with(P.instanceOf(Error), (err) => {
              logger.warn(`Invalid authentication provided: ${err.message}`);
              throw ErrorHandling.genericError("Invalid claims");
            })
            .otherwise((claimsRes: AuthData) => {
              req.ctx = {
                authData: { ...claimsRes },
                correlationId,
              };
              next();
            });
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
              "agid-jwt-signature": P.string,
              "agid-jwt-trackingevidence": P.string,
            },
            async (headers) => {
              console.log("Matching headers with authorization, correlation ID, agid-jwt-signature, agid-jwt-trackingevidence");
              await addCtxAuthData(
                headers.authorization,
                headers["x-correlation-id"]
              );
            }
          )
          .otherwise(() => {
            console.log("No matching headers found");
            if (headers.data["x-correlation-id"] === null || headers.data["x-correlation-id"] === undefined) {
              console.log("No matching headers found: x-correlation-id");
              throw ErrorHandling.missingHeader("Header error ");
            }
            if (headers.data["agid-jwt-signature"] === null || headers.data["agid-jwt-signature"] === undefined) {
              console.log("No matching headers found: agid-jwt-signature");
              throw ErrorHandling.missingHeader("Header error ");
            }
            if (headers.data["agid-jwt-trackingevidence"] === null || headers.data["agid-jwt-trackingevidence"] === undefined) {
              console.log("No matching headers found: agid-jwt-trackingevidence");
              throw ErrorHandling.missingHeader("Header error ");
            }
            else {
              throw ErrorHandling.missingHeader("other");
            }
          });
      } catch (error) {
        if (error instanceof Object && !('code' in error)) {
          if ('message' in error) logger.error(`authenticationMiddleware - error not managed with message: ${error.message}`);
          return res.status(500).json().end();
        }
        const problem = makeApiProblem(error, (err) =>
          match(err.code)
            .with("unauthorizedError", () => 401)
            .with("operationForbidden", () => 403)
            .with("missingHeader", () => 400)
            .with("genericError", () => 400)
            .otherwise(() => 500)
        );
        return res.status(problem.status).json(problem).end();
      }
    };

    return authMiddleware;
  };
