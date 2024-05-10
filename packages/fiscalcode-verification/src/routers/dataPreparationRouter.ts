import {  ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext, logger } from "pdnd-common";
import { api } from "../model/generated/api.js";
import DataPreparationService from "../services/dataPreparationService.js";
//import { getContext } from "pdnd-common";
import { contextDataMiddleware } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import {  makeApiProblem} from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {  apiFiscalcodeModelToDataPreparationResponse, apiDatapreparationTemplateToFiscalcodeModel } from "../model/domain/apiConverter.js";
import { ErrorHandling } from "pdnd-models";
//import { ErrorHandling } from "pdnd-models";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);


  dataPreparationRouter.post(
    "/fiscalcode-verification/data-preparation",
    contextDataMiddleware,
    authenticationMiddleware(),
    async (req, res) => {
      try {
        await DataPreparationService.saveList(apiDatapreparationTemplateToFiscalcodeModel(req.body));
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/fiscalcode-verification/data-preparation/all",
    contextDataMiddleware,
    authenticationMiddleware(),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.getAll();
        const result = data != null ?
            apiFiscalcodeModelToDataPreparationResponse(data)
            : [];
          logger.info(result);
          return res.status(200).json(result).end();

      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );



  dataPreparationRouter.delete(
    "/fiscalcode-verification/data-preparation/reset",
    contextDataMiddleware,
    authenticationMiddleware(),
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

  dataPreparationRouter.post(
    "/fiscalcode-verification/data-preparation/remove",
    contextDataMiddleware,
    authenticationMiddleware(),
    async (req, res) => {
      try {
        await DataPreparationService.saveList(apiDatapreparationTemplateToFiscalcodeModel(req.body));
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