import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ErrorHandling } from "pdnd-models";
import {
  authenticationMiddleware,
  ExpressContext,
  ZodiosContext,
  FamilyStatusService,
  RawPayload,
  generateObjectId,
  getEserviceIdFromToken,
  getPDNDTokenM2M,
  HashAlgorithm,
  logger,
  SignalPayload,
  SHService,
} from "pdnd-common";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, userModelNotFound } from "../exceptions/errors.js";
import { contextDataFamilyMiddleware } from "../context/context.js";
import { familyStatusConfiguration } from "../config/config.js";

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/family-status/data-preparation",
    contextDataFamilyMiddleware,
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        const data = await FamilyStatusService.prepareData(
          req.body as RawPayload
        );
        if (!data) {
          throw userModelNotFound(
            `Data with subjectId '${req.body.subject?.subjectId}' not found`
          );
        }
        if (data.isUpdate) {
          logger.info(
            `[Router] Update detected for ${data.uuid}. Initiating Signal Hub flow.`
          );
          const authHeader = req.headers.authorization;
          const pdndToken = authHeader?.split(" ")[1];
          if (!pdndToken) {
            throw new Error("PDND token not found in request.");
          }

          const eserviceId = await getEserviceIdFromToken(pdndToken);
          const fiscalCode = (req.body as RawPayload).subject?.subjectId;
          logger.info(
            `[SHRepository] Found fiscalCode: ${JSON.stringify(fiscalCode)}`
          );
          if (!fiscalCode) {
            throw new Error("Fiscal Code not found for 'objectId' generation.");
          }

          const seed = await SHService.findSeedByEserviceId(
            eserviceId,
            familyStatusConfiguration
          );
          if (!seed) {
            throw new Error(
              `Could not find 'seed' for eserviceId: ${eserviceId}`
            );
          }

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

          const m2mToken = await getPDNDTokenM2M(familyStatusConfiguration);

          if (!m2mToken) {
            throw new Error("M2M token generation failed.");
          }
          const signalObject: SignalPayload = {
            objectType: "nucleo_familiare",
            eserviceId,
            objectId,
            signalId,
            signalType: "UPDATE",
          };

          try {
            await SHService.sendSignal(
              signalObject,
              m2mToken,
              familyStatusConfiguration
            );
          } catch (error) {
            logger.error(
              `[Controller] Error sending signal. Reverting signalId for ${eserviceId}. Error: ${error}`
            );
            throw new Error(`Signal Hub Deposit Failed: ${error}`);
          }
        }
        const responsePayload = {
          uuid: data.uuid,
        };
        return res.status(201).json(responsePayload).end();
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
        const data = await FamilyStatusService.getAll();

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
        const data = await FamilyStatusService.getByUUID(req.params.uuid);
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
        await FamilyStatusService.deleteAll();
        return res.status(204).end();
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
        const paramUUID = req.params.uuid;
        if (!paramUUID) {
          throw new Error("UUID Params missing");
        }
        const fiscalCode = await SHService.getFiscalCodeFromFamily(paramUUID);
        if (!fiscalCode) {
          throw new Error("Fiscal code missing");
        }
        await FamilyStatusService.deleteByUUID(req.params.uuid);

        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);

        const seed = await SHService.findSeedByEserviceId(
          eserviceId,
          familyStatusConfiguration
        );

        if (!seed) {
          throw new Error(
            `Could not find 'seed' for eserviceId: ${eserviceId}`
          );
        }

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

        const m2mToken = await getPDNDTokenM2M(familyStatusConfiguration);

        if (!m2mToken) {
          throw new Error("M2M token generation failed.");
        }
        const signalObject: SignalPayload = {
          objectType: "nucleo_familiare",
          eserviceId,
          objectId,
          signalId,
          signalType: "DELETE",
        };

        try {
          await SHService.sendSignal(
            signalObject,
            m2mToken,
            familyStatusConfiguration
          );
        } catch (error) {
          logger.error(
            `[Controller] Error sending signal. Reverting signalId for ${eserviceId}. Error: ${error}`
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
