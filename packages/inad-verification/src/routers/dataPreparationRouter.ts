import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext, logger } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { api } from "../model/generated/api.js";
import DataPreparationService from "../services/dataPreparationService.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel,
  convertArrayOfModelsToResponseListRequestDigitalAddress,
  responseRequestDigitalAddressModelToResponseRequestDigitalAddress,
} from "../model/domain/apiConverter.js";
import { contextDataInadMiddleware } from "../context/context.js";
import { ErrorHandling } from "pdnd-models";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/inad-verification/data-preparation",
    contextDataInadMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        await DataPreparationService.saveList(
          ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel(req.body)
        );
        return res.status(200).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/inad-verification/data-preparation",
    contextDataInadMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.getAll();
        const result = data  ? convertArrayOfModelsToResponseListRequestDigitalAddress(data) : undefined
        if(result) {
          return res.status(200).json(result).end();
        } else {
          return res.status(200).end();
        }
        
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/inad-verification/data-preparation/:codiceFiscale",
    contextDataInadMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await DataPreparationService.findByFiscalCode(req.params.codiceFiscale);
  
        const result = data  ? responseRequestDigitalAddressModelToResponseRequestDigitalAddress(data) : undefined
        if(result) {
          return res.status(200).json(result).end();
        } else {
          return res.status(200).end();
        }
        
      } catch (error) {
        logger.error(error)
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/inad-verification/data-preparation",
    contextDataInadMiddleware,
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
    "/inad-verification/data-preparation/:codiceFiscale",
    contextDataInadMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        await DataPreparationService.deleteByFiscalCode(req.params.codiceFiscale);
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
