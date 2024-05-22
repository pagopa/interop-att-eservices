// import { zodiosRouter } from "@zodios/express";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ErrorHandling, UserModel } from "pdnd-models";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import DataPreparationService from "../services/dataPreparationService.js";
import {
  userModelToApiDataPreparationResponseCf,
  userModelToApiDataPreparationTemplateResponse,
} from "../model/domain/apiConverter.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, userModelNotFound } from "../exceptions/errors.js";
import { DataPreparationTemplateResponse } from "../model/domain/models.js";
import { contextDataResidenceMiddleware } from "../context/context.js";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);


  dataPreparationRouter.post(
    "/residence-verification/data-preparation",
    contextDataResidenceMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        const data = await DataPreparationService.saveList(req.body);
        const result = userModelToApiDataPreparationResponseCf(
          data,
          req.body.soggetto?.codiceFiscale
        );
        if (!result) {
          throw userModelNotFound(
            `Data with fiscal code '${req.body.soggetto?.codiceFiscale}' not found`
          );
        }
        return res.status(200).json(result).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/residence-verification/data-preparation",
    contextDataResidenceMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.getAll();
        const result: DataPreparationTemplateResponse[] = data
          ? data.map((user: UserModel) =>
              userModelToApiDataPreparationTemplateResponse(user)
            )
          : [];

        return res.status(200).json(result).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/residence-verification/data-preparation/:uuid",
    contextDataResidenceMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          return res.status(500);
        }
        const data = await DataPreparationService.getByUUID(req.params.uuid);
        const result: DataPreparationTemplateResponse | null = data
          ? userModelToApiDataPreparationTemplateResponse(data)
          : null;
        return result
          ? res.status(200).json(result).end()
          : res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/residence-verification/data-preparation",
    contextDataResidenceMiddleware,
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

  dataPreparationRouter.delete(
    "/residence-verification/data-preparation/:uuid",
    contextDataResidenceMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          return res.status(500);
        }
        await DataPreparationService.deleteByUUID(req.params.uuid);
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
