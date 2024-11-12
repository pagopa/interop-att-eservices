import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationCorrelationMiddleware } from "pdnd-common";
import { TrialService } from "trial";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  makeApiProblem,
  mapGeneralErrorModel,
  userModelNotFound,
} from "../exceptions/errors.js";
import { integrityValidationMiddleware } from "../interoperability/integrityValidationMiddleware.js";
import { auditValidationMiddleware } from "../interoperability/auditValidationMiddleware.js";
import { contextDataFamilyMiddleware } from "../context/context.js";
import familyStatusController from "../controllers/familyStatusController.js";

const familyStatusRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const familyStatusRouter = ctx.router(api.api);

  familyStatusRouter.post(
    "/family-status",
    contextDataFamilyMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] familyStatusRouter: ${req.body}`);
        const data = await familyStatusController.findUser(req.body);
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "FAMILY_STATUS",
          "OK"
        );
        logger.info(`[END] familyStatusRouter`);
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
          "FAMILY_STATUS",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  return familyStatusRouter;
};
export default familyStatusRouter;
