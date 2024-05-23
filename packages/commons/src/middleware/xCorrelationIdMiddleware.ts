import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { ErrorHandling, makeApiProblemBuilder } from "pdnd-models";
import { match } from "ts-pattern";
import { ExpressContext, getContext, syncEventEmitter } from "../index.js";
import { logger } from "../logging/index.js";

const makeApiProblem = makeApiProblemBuilder(logger, {});
/* eslint-disable */

export const uniquexCorrelationIdMiddleware: (isEnableTrial: boolean) => ZodiosRouterContextRequestHandler<ExpressContext> =
  (isEnableTrial) => {
    const uniquexCorrelationIdMiddleware: ZodiosRouterContextRequestHandler<
      ExpressContext
    > = async (req, res, next): Promise<unknown> => {
      try {
        if (!isEnableTrial || !req) {
          return next();
        } else {
          const context = getContext();
          const response = await syncEventEmitter.emitSync('checkCorrelationId', context.correlationId);
          console.log(`Response: ${response}`);
          if (response) {
              logger.error("x-correlation-id alredy exist");
              throw ErrorHandling.xCorrelationIdNotValidError();
          }
        }
        logger.info(`[COMPLETED] xCorrelationIdMiddleware`);
        return next();
      } catch (error) {
        if (error instanceof Object && !("code" in error)) {
          if ("message" in error) {
            logger.error(
              `xCorrelationIdMiddleware - error not managed with message: ${error.message}`
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
            .with("xCorrelationIdNotValid", () => 500)
            .otherwise(() => 500)
        );
        return res.status(problem.status).json(problem).end();
      }
    };

    return uniquexCorrelationIdMiddleware;
  };
/* eslint-enable */
