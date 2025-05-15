import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationCorrelationMiddleware } from "pdnd-common";
import { TrialService } from "trial";
import ResidenceSubmissionController from "../controllers/residenceSubmissionController.js";
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

const residenceSubissionController = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceSubissionController = ctx.router(api.api);
  /*   residenceSubissionController.use(contextDataMiddleware);

  residenceSubissionController.use(authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware()); */

  residenceSubissionController.put(
    "/residence-submission",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceSubissionController: ${req.body}`);
        const data: any = await ResidenceSubmissionController.upsertUser(
          req.body
        ); // TODO: da gestire il tipo della costante "data"
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_VERIFICATION_001", // TODO: da controllare
          "OK"
        );
        logger.info(`[END] residenceSubissionController`);
        return res.status(200).json(data).end(); // TODO: da controllare se sia il caso da ritornare l'oggetto salvato
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
          "RESIDENCE_VERIFICATION_001", // TODO: da controllare
          "KO",
          JSON.stringify(generalErrorResponse),
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return residenceSubissionController;
};
export default residenceSubissionController;
