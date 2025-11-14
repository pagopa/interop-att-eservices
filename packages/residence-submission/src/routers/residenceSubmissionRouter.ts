/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  logger,
  ExpressContext,
  ZodiosContext,
  authenticationCorrelationMiddleware,
  TrialService,
  integrityValidationMiddleware,
  auditValidationMiddleware,
  getEserviceIdFromToken,
  generateObjectId,
  SHService,
  HashAlgorithm,
  getPDNDTokenM2M,
} from "pdnd-common";
import ResidenceSubmissionController from "../controllers/residenceSubmissionController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  makeApiProblem,
  mapGeneralErrorModel,
  userModelNotFound,
} from "../exceptions/errors.js";
import { contextDataResidenceMiddleware } from "../context/context.js";
import { SignalPayload } from "../../../commons/dist/services/signalHub/shService.js";

const residenceSubissionController = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceSubissionController = ctx.router(api.api);

  residenceSubissionController.post(
    "/residence-submission",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceSubissionController: ${req.body}`);
        const data: any = await ResidenceSubmissionController.createUser(
          req.body
        );
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController`);
        return res.status(201).json(data).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        const correlationId = req.headers["x-correlation-id"] as string;
        const generalErrorResponse = mapGeneralErrorModel(
          correlationId,
          errorRes
        );
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  residenceSubissionController.put(
    "/residence-submission",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        logger.info(`[START] residenceSubissionController update: ${req.body}`);
        const data: any = await ResidenceSubmissionController.updateUser(
          req.body
        );
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }

        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const fiscalCode =
          req.body.subjects?.subject?.[0]?.generality?.subjectId?.subjectId;
        logger.info(
          `[SHRepository] Found fiscalCode: ${JSON.stringify(fiscalCode)}`
        );
        if (!fiscalCode) {
          throw new Error("Fiscal Code not found for 'objectId' generation.");
        }

        const seed = await SHService.findSeedByEserviceId(eserviceId);
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

        const m2mToken = await getPDNDTokenM2M();
        if (!m2mToken) {
          throw new Error("M2M token generation failed.");
        }
        const signalObject: SignalPayload = {
          objectType: "residenza",
          eserviceId,
          objectId,
          signalId,
          signalType: "UPDATE",
        };
        logger.info(`[signalObject]: ${JSON.stringify(signalObject)}`);

        await SHService.sendSignal(signalObject, m2mToken);
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController update`);
        return res.status(200).json(data).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        const correlationId = req.headers["x-correlation-id"] as string;
        const generalErrorResponse = mapGeneralErrorModel(
          correlationId,
          errorRes
        );
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  residenceSubissionController.delete(
    "/residence-submission/:id",
    contextDataResidenceMiddleware,
    authenticationCorrelationMiddleware(true),
    integrityValidationMiddleware(),
    auditValidationMiddleware(),
    async (req, res) => {
      try {
        const { id } = req.params;
        logger.info(`[START] residenceSubissionController delete: ${id}`);
        const data: any = await ResidenceSubmissionController.deleteUser(id);
        if (!data) {
          throw userModelNotFound();
        }
        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const fiscalCode = req.params.id;
        if (!fiscalCode) {
          throw new Error("Fiscal Code not found for 'objectId' generation.");
        }
        const seed = await SHService.findSeedByEserviceId(eserviceId);
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
        const m2mToken = await getPDNDTokenM2M();
        if (!m2mToken) {
          throw new Error("M2M token generation failed.");
        }

        const signalObject: SignalPayload = {
          objectType: "residenza",
          eserviceId,
          objectId,
          signalId,
          signalType: "DELETE",
        };
        await SHService.sendSignal(signalObject, m2mToken);

        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController delete`);
        return res.status(204).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        const correlationId = req.headers["x-correlation-id"] as string;
        const generalErrorResponse = mapGeneralErrorModel(
          correlationId,
          errorRes
        );
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  return residenceSubissionController;
};
export default residenceSubissionController;
