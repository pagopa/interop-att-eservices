import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  ExpressContext,
  ZodiosContext,
  FiscalCodeService,
  logger,
  authenticationMiddleware,
} from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { api } from "../model/generated/api.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  apiFiscalcodeModelToDataPreparationResponse,
  apiDatapreparationTemplateToFiscalcodeModel,
} from "../model/domain/apiConverter.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        await FiscalCodeService.saveList(
          apiDatapreparationTemplateToFiscalcodeModel(req.body)
        );
        return res.status(201).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await FiscalCodeService.getAll();
        const result =
          data != null ? apiFiscalcodeModelToDataPreparationResponse(data) : [];
        logger.info(result);
        return res.status(200).json(result).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        await FiscalCodeService.deleteAllByKey();

        return res.status(204).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );
  /* eslint-disable */
  dataPreparationRouter.post(
    "/subject-id-verification/data-preparation/remove",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      /* eslint-enable */
      try {
        await FiscalCodeService.deleteByFiscalCode(
          apiDatapreparationTemplateToFiscalcodeModel(req.body).fiscalCode
        );
        return res.status(201).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  return dataPreparationRouter;
};
export default dataPreparationRouter;
