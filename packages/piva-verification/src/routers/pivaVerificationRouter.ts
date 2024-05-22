import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import PivaVerificationController from "../controllers/pivaVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import logHeadersMiddleware from "../middlewares/logHeaderMiddleware.js";
import { contextDataPivaMiddleware } from "../context/context.js";
import { authenticationMiddleware , uniquexCorrelationIdMiddleware } from "pdnd-common";
import { verifyCertValidity } from "../security/certValidityMiddleware.js";

const pivaVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const pivaVerificationRouter = ctx.router(api.api);

  pivaVerificationRouter.post(
    "/piva-verification/verifica",
    logHeadersMiddleware,
    contextDataPivaMiddleware,
    uniquexCorrelationIdMiddleware(true),
    authenticationMiddleware(true),
    verifyCertValidity,
    async (req, res) => {
      try {

        console.log('Request Headers:', req.headers);

        logger.info(`[START] Post - '/verifica' : ${req.body.codiceFiscale}`);
        const data = await PivaVerificationController.findPiva(
          req.body
        );
        logger.info(`[END] Post - '/verifica'`);
        return res.status(200).json(data).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        const correlationId = req.headers["x-correlation-id"] as string;
        const generalErrorResponse = mapGeneralErrorModel(
          correlationId,
          errorRes
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return pivaVerificationRouter;
};

export default pivaVerificationRouter;
