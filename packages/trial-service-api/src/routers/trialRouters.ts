import { authenticationMiddleware, logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import trialController from "../controllers/trialController.js";
import { TrialPaginatedRequestParams } from "../model/trialPaginatedRequestParams.js";

const trialRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const trialRouter = ctx.router(api.api);

  trialRouter.get("/trial/check", async (req, res) => {
    try {
      logger.info("[START] GET - '/trial/check'");
      const data = await trialController.findAllChecks();
      logger.info(`[END] GET - '/trial/check'`);
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
  });

  trialRouter.get("/trial/category", async (req, res) => {
    try {
      logger.info("[START] GET - '/trial/check'");
      const data = await trialController.findAllCategories();
      logger.info(`[END] GET - '/trial/check'`);
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
  });

  trialRouter.get(
    "/trial/search",
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        logger.info("[START] POST - '/trial/search'");
        const request = TrialPaginatedRequestParams.validate(req.query);
        const data = await trialController.findPaginatedTrials(request);
        logger.info(`[END] POST - '/trial/search'`);
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

  return trialRouter;
};

export default trialRouter;
