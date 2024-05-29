/*import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {
  authenticationMiddleware,
  uniquexCorrelationIdMiddleware,
} from "pdnd-common";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataDigitalAddressMiddleware } from "../context/context.js";

const digitalAddressVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);

  fiscalcodeVerificationRouter.post(
    "/digital-address-verification/listDigitalAddress",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(true),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.codiceFiscale}`);
        const data = await FiscalcodeVerificationController.findFiscalcode(
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

  fiscalcodeVerificationRouter.get(
    "/digital-address-verification/verify/:codice_fiscale",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(true),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.codiceFiscale}`);
        const data = await FiscalcodeVerificationController.findFiscalcode(
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

  return fiscalcodeVerificationRouter;
};

export default digitalAddressVerificationRouter;*/
