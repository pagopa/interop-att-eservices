import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  ExpressContext,
  HashAlgorithm,
  SHService,
  ZodiosContext,
  generateObjectId,
  getEserviceIdFromToken,
  getPDNDTokenM2M,
  logger,
} from "pdnd-common";
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
import { SignalPayload } from "../../../commons/dist/services/signalHub/shService.js";

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
        return res.status(204).end();
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
        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const organizationId = req.body.organizationId;
        logger.info(
          `[SHRepository] Found fiscalCode: ${JSON.stringify(organizationId)}`
        );
        if (!organizationId) {
          throw new Error(
            "Organization ID not found for 'objectId' generation."
          );
        }

        const seed = await SHService.findSeedByEserviceId(eserviceId);
        if (!seed) {
          throw new Error(
            `Could not find 'seed' for eserviceId: ${eserviceId}`
          );
        }

        const objectId = await generateObjectId(
          organizationId,
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

        const m2mToken = await getPDNDTokenM2M();
        if (!m2mToken) {
          throw new Error("M2M token generation failed.");
        }
        const signalObject: SignalPayload = {
          objectType: "partita_iva",
          eserviceId,
          objectId,
          signalId,
          signalType: "DELETE",
        };
        try {
          await SHService.sendSignal(signalObject, m2mToken);
        } catch (error) {
          logger.error(
            `[Controller] Error sending signal. Reverting signalId for ${eserviceId}. Error: ${error}`
          );
        }
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
