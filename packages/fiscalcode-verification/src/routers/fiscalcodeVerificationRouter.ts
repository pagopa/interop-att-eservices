import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationMiddleware , uniquexCorrelationIdMiddleware } from "pdnd-common";
import FiscalcodeVerificationController from "../controllers/fiscalcodeVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { verifyCertValidity } from "../security/certValidityMiddleware.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";
//import logHeadersMiddleware from "../middlewares/logHeaderMiddleware.js";

const fiscalcodeVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);
  /*   residenceVerificationRouter.use(contextDataMiddleware);
  const upload = multer({ storage: multer.memoryStorage() });

  fiscalcodeVerificationRouter.use(authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware()); */

  // Middleware per il parsing del corpo della richiesta multipart/form-data
  // Endpoint per gestire il caricamento del file e il corpo della richiesta
  fiscalcodeVerificationRouter.post(
    "/fiscalcode-verification/verifica",
    //logHeadersMiddleware,
    contextDataFiscalCodeMiddleware,
    uniquexCorrelationIdMiddleware(true),
    authenticationMiddleware(true),
    verifyCertValidity,
    async (req, res) => {
      try {
             // Log all request headers
     console.log('Request Headers:', req.headers);

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

export default fiscalcodeVerificationRouter;
