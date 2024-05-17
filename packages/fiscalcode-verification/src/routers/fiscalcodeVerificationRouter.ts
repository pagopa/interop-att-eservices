import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { contextDataMiddleware } from "pdnd-common";
import multer from "multer";
import FiscalcodeVerificationController from "../controllers/fiscalcodeVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { verifyCertValidity } from "../security/certValidityMiddleware.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { convertStringToRichiesta } from "../utilities/jsonFiscalcodeUtilities.js";

const fiscalcodeVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);
  /*   residenceVerificationRouter.use(contextDataMiddleware);
  const upload = multer({ storage: multer.memoryStorage() });

  fiscalcodeVerificationRouter.use(authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware()); */
  const upload = multer({ storage: multer.memoryStorage() });

  // Middleware per il parsing del corpo della richiesta multipart/form-data

  // Endpoint per gestire il caricamento del file e il corpo della richiesta
  fiscalcodeVerificationRouter.post(
    "/fiscalcode-verification/verifica",
    upload.single("certificate"),
    contextDataMiddleware,
    authenticationMiddleware(true),
    verifyCertValidity,
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.codiceFiscale}`);
        const richiesta = convertStringToRichiesta(req.body.content);
        const data = await FiscalcodeVerificationController.findFiscalcode(
          richiesta
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
