import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {
  authenticationMiddleware,
  uniquexCorrelationIdMiddleware,
} from "pdnd-common";
import { TrialService } from "trial";
import ResidenceVerificationController from "../controllers/residenceVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  makeApiProblem,
  mapGeneralErrorModel,
  userModelNotFound,
} from "../exceptions/errors.js";
import { integrityValidationMiddleware } from "../interoperability/integrityValidationMiddleware.js";
import { auditValidationMiddleware } from "../interoperability/auditValidationMiddleware.js";
import { contextDataResidenceMiddleware } from "../context/context.js";

const residenceVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceVerificationRouter = ctx.router(api.api);
  /*   residenceVerificationRouter.use(contextDataMiddleware);

  residenceVerificationRouter.use(authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware()); */

  residenceVerificationRouter.post(
    "/residence-verification",
    contextDataResidenceMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceVerificationRouter: ${req.body}`);
        const data = await ResidenceVerificationController.findUser(req.body);
        if (!data || data.soggetti?.soggetto?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_VERIFICATION_001",
          "OK"
        );
        logger.info(`[END] residenceVerificationRouter`);
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
          "RESIDENCE_VERIFICATION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  
  residenceVerificationRouter.post(
    "/residence-verification/verify",
    contextDataResidenceMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] Verfy ResidenceVerificationRouter: ${req.body}`);
        const data = await ResidenceVerificationController.findUserVerify(req.body);
        /*if (!data) {
          throw userModelNotFound();
        }*/
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_VERIFICATION_002",
          "OK"
        );
        logger.info(`[END] Verfy ResidenceVerificationRouter`);
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
          "RESIDENCE_VERIFICATION_002",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return residenceVerificationRouter;
};
export default residenceVerificationRouter;
