import {
  authenticationCorrelationMiddleware,
  logger,
  ZodiosContext,
  TrialService,
  integrityValidationMiddleware,
  auditValidationMiddleware,
  ExpressContext,
} from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import ResidenceVerificationController from "../controllers/residenceVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  makeApiProblem,
  mapGeneralErrorModel,
  userModelNotFound,
} from "../exceptions/errors.js";
import { contextDataResidenceMiddleware } from "../context/context.js";
import { residenceVerificationDirectConfig } from "../config/config.js";

const residenceVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceVerificationDirectRouter = ctx.router(api.api);

  residenceVerificationDirectRouter.post(
    "/residence-verification-direct",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(
      true,
      residenceVerificationDirectConfig
    ),
    integrityValidationMiddleware(residenceVerificationDirectConfig),
    auditValidationMiddleware(residenceVerificationDirectConfig),
    async (req, res) => {
      try {
        logger.info(
          `[START] residenceVerificationRouter: ${JSON.stringify(req.body)}`
        );
        const data = await ResidenceVerificationController.findUser(req.body);
        if (!data || data.subjects?.subject?.length === 0) {
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

  residenceVerificationDirectRouter.post(
    "/residence-verification-direct/check",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(
      true,
      residenceVerificationDirectConfig
    ),
    integrityValidationMiddleware(residenceVerificationDirectConfig),
    auditValidationMiddleware(residenceVerificationDirectConfig),
    async (req, res) => {
      try {
        const data = await ResidenceVerificationController.findUserVerify(
          req.body
        );
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_VERIFICATION_002",
          "OK"
        );
        logger.info(`[END] Verify ResidenceVerificationRouter`);
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
  return residenceVerificationDirectRouter;
};
export default residenceVerificationRouter;
