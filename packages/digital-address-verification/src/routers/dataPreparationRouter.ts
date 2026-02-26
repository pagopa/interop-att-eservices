import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  ExpressContext,
  HashAlgorithm,
  SHService,
  SignalPayload,
  ZodiosContext,
  generateObjectId,
  getEserviceIdFromToken,
  getPDNDTokenM2M,
  logger,
} from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { api } from "../model/generated/api.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel,
  convertArrayOfModelsToResponseListRequestDigitalAddress,
  responseRequestDigitalAddressModelToResponseRequestDigitalAddress,
} from "../model/domain/apiConverter.js";
import dataPreparationController from "../controllers/dataPreparationController.js";
import { contextDataDigitalAddressMiddleware } from "../context/context.js";
import { digitalAddressVerificationConfig } from "../config/config.js";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/digital-address-verification/data-preparation",
    contextDataDigitalAddressMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        const responseData = await dataPreparationController.saveList(
          ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel(
            req.body
          )
        );
        if (responseData) {
          return res.status(200).end();
        } else {
          return res.status(201).end();
        }
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/digital-address-verification/data-preparation",
    contextDataDigitalAddressMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await dataPreparationController.getAll();
        const result = data
          ? convertArrayOfModelsToResponseListRequestDigitalAddress(data)
          : undefined;
        if (result) {
          return res.status(200).json(result).end();
        } else {
          return res.status(200).json({}).end();
        }
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/digital-address-verification/data-preparation/:idSubject",
    contextDataDigitalAddressMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await dataPreparationController.findByFiscalCode(
          req.params.idSubject
        );

        const result = data
          ? responseRequestDigitalAddressModelToResponseRequestDigitalAddress(
              data
            )
          : undefined;
        if (result) {
          return res.status(200).json(result).end();
        } else {
          return res.status(404).end();
        }
      } catch (error) {
        logger.error(error);
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/digital-address-verification/data-preparation",
    contextDataDigitalAddressMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        await dataPreparationController.deleteAllByKey();
        return res.status(204).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );
  dataPreparationRouter.delete(
    "/digital-address-verification/data-preparation/:idSubject",
    contextDataDigitalAddressMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }

        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const fiscalCode = req.params.idSubject;
        if (!fiscalCode) {
          throw new Error("Fiscal Code not found for 'objectId' generation.");
        }
        const seed = await SHService.findSeedByEserviceId(
          eserviceId,
          digitalAddressVerificationConfig
        );
        if (!seed) {
          throw new Error(
            `Could not find 'seed' for eserviceId: ${eserviceId}`
          );
        }

        const data = await dataPreparationController.findByFiscalCode(
          req.params.idSubject
        );
        if (data == null) {
          return res.status(404).end();
        }
        await dataPreparationController.deleteByFiscalCode(
          req.params.idSubject
        );
        const objectId = await generateObjectId(
          fiscalCode,
          HashAlgorithm.SHA256,
          seed
        );
        if (!objectId) {
          throw new Error("Failed to generate 'objectId'.");
        }

        const signalId = await SHService.getNextSignalId(eserviceId);

        if (signalId === null || signalId === undefined) {
          throw new Error(
            `Failed to retrieve next 'signalId' for eserviceId: ${eserviceId}`
          );
        }
        const m2mToken = await getPDNDTokenM2M(
          digitalAddressVerificationConfig
        );
        if (!m2mToken) {
          throw new Error("M2M token generation failed.");
        }

        const signalObject: SignalPayload = {
          objectType: "digital-address",
          eserviceId,
          objectId,
          signalId,
          signalType: "DELETE",
        };
        try {
          await SHService.sendSignal(
            signalObject,
            m2mToken,
            digitalAddressVerificationConfig
          );
        } catch (error) {
          logger.error(
            `[Controller] Error sending signal for eserviceId ${eserviceId} and signalId ${signalId}. No revert operation was performed. Error: ${error}`
          );
        }

        return res.status(204).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );
  return dataPreparationRouter;
};
export default dataPreparationRouter;
