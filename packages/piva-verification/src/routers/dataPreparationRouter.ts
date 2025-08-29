import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext, logger } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { PivaVerificationService } from "pdnd-common";
import { api } from "../model/generated/api.js";
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
        await PivaVerificationService.saveList(
          apiDatapreparationTemplateToPivaModel(req.body)
        );
        return res.status(201).end();
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
        const data = await PivaVerificationService.getAll();
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
        await PivaVerificationService.deleteAllByKey();
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.post(
    "/organization-id-verification/data-preparation/remove",
    contextDataPivaMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        const data = await PivaVerificationService.deleteByPiva(
          apiDatapreparationTemplateToPivaModel(req.body)
        );
        if (data == null) {
          return res.status(404).end();
        }
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
