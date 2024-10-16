import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext, logger } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { api } from "../model/generated/api.js";
import DataPreparationService from "../services/dataPreparationService.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  apiPartitaIvaModelToDataPreparationResponse,
  apiDatapreparationTemplateToPivaModel,
} from "../model/domain/apiConverter.js";
import { contextDataPivaMiddleware } from "../context/context.js";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/organization-id-verification/data-preparation",
    contextDataPivaMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        await DataPreparationService.saveList(
          apiDatapreparationTemplateToPivaModel(req.body)
        );
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/organization-id-verification/data-preparation",
    contextDataPivaMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.getAll();
        const result =
          data != null ? apiPartitaIvaModelToDataPreparationResponse(data) : [];
        logger.info(result);
        return res.status(200).json(result).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/organization-id-verification/data-preparation",
    contextDataPivaMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.deleteAllByKey();
        if (data !== 0) {
          throw ErrorHandling.genericError(
            `Not all data could be deleted. Remaining: ${data}`
          );
        }
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );
  /* eslint-disable */
  dataPreparationRouter.post(
    "/organization-id-verification/data-preparation/remove",
    contextDataPivaMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      /* eslint-enable */
      try {
        await DataPreparationService.deleteByPiva(
          apiDatapreparationTemplateToPivaModel(req.body).organizationId
        );
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  return dataPreparationRouter;
};
export default dataPreparationRouter;
