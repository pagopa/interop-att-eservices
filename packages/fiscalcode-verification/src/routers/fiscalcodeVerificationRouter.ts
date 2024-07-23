import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {
  authenticationMiddleware,
  uniquexCorrelationIdMiddleware,
} from "pdnd-common";
import { TrialService } from "trial";
import FiscalcodeVerificationController from "../controllers/fiscalcodeVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
//import { verifyCertValidity } from "../security/certValidityMiddleware.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";

const fiscalcodeVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);

  fiscalcodeVerificationRouter.post(
    "/fiscalcode-verification/verifica",
    // logHeadersMiddleware,
    contextDataFiscalCodeMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    //verifyCertValidity,
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.codiceFiscale}`);
        const data = await FiscalcodeVerificationController.findFiscalcode(
          req.body
        );
        void TrialService.insert(
          req.url,
          req.method,
          "FISCALCODE_VERIFICATION",
          "OK"
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
        void TrialService.insert(
          req.url,
          req.method,
          "FISCALCODE_VERIFICATION",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return fiscalcodeVerificationRouter;
};

export default fiscalcodeVerificationRouter;
