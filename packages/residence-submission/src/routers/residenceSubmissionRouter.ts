/* eslint-disable @typescript-eslint/no-explicit-any */
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

  residenceSubissionController.post(
    "/residence-submission",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceSubissionController: ${req.body}`);
        const data: any = await ResidenceSubmissionController.createUser(
          req.body
        ); // TODO: handle the type of the "data" constant
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController`);
        // TODO: handle the error after saving
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
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  residenceSubissionController.put(
    "/residence-submission",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceSubissionController update: ${req.body}`);
        const data: any = await ResidenceSubmissionController.updateUser(
          req.body
        ); // TODO: handle the type of the "data" constant
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController update`);
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
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  residenceSubissionController.delete(
    "/residence-submission/:id",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        const { id } = req.params;
        logger.info(`[START] residenceSubissionController delete: ${id}`);
        const data: any = await ResidenceSubmissionController.deleteUser(id);
        if (!data) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController delete`);
        return res.status(200).end();
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
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  return residenceSubissionController;
};
export default residenceSubissionController;
