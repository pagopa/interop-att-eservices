import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ErrorHandling } from "pdnd-models";
import { ExpressContext, ZodiosContext, familyStatus } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { RawPayload } from "pdnd-common";
import DataPreparationService from "../services/dataPreparationService.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, userModelNotFound } from "../exceptions/errors.js";
import { contextDataFamilyMiddleware } from "../context/context.js";


const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/family-status/data-preparation",
    contextDataFamilyMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        const data = await familyStatus.prepareData(req.body as RawPayload);
        if (!data) {
          throw userModelNotFound(
            `Data with subjectId '${req.body.subject?.subjectId}' not found`
          );
        }
        return res.status(200).json(data).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/family-status/data-preparation",
    contextDataFamilyMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await familyStatus.getAll();

        return res.status(200).json(data).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/family-status/data-preparation/:uuid",
    contextDataFamilyMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          return res.status(500);
        }
        const data = await familyStatus.getByUUID(req.params.uuid);
        const result: RawPayload | null = data ? (data as RawPayload) : null;
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
    "/family-status/data-preparation",
    contextDataFamilyMiddleware,
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
    "/family-status/data-preparation/:uuid",
    contextDataFamilyMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          return res.status(500);
        }
        await familyStatus.deleteByUUID(req.params.uuid);
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
