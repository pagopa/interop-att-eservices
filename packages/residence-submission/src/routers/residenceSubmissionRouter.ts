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
import { SignalPayload } from "../../../commons/dist/services/signalHub/SHService.js";

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
          throw new Error("Token PDND non trovato nella richiesta.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const fiscalCode = data.subjects?.subject[0]?.generality?.subjectId
          .subjectId as string;
        if (!fiscalCode) {
          throw new Error(
            "Codice Fiscale non trovato per la generazione dell'objectId."
          );
        }

        const seed = await SHService.findSeedByEserviceId(eserviceId);
        const objectId = await generateObjectId(fiscalCode, "sha256", seed);
        const signalId = await SHService.getNextSignalId(eserviceId);
        const singalObject: SignalPayload = {
          objectType: "residenza",
          eserviceId,
          objectId,
          signalId,
          signalType: "UPDATE",
        };
        await SHService.sendSignal(singalObject);
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
          throw new Error("Token PDND non trovato nella richiesta.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const fiscalCode = req.params.id;
        if (!fiscalCode) {
          throw new Error(
            "Codice Fiscale non trovato per la generazione dell'objectId."
          );
        }
        // aggiungere if controlli funzioni
        const seed = await SHService.findSeedByEserviceId(eserviceId);
        const objectId = await generateObjectId(fiscalCode, "sha256", seed);
        const signalId = await SHService.getNextSignalId(eserviceId);
        // aggiungere il tipo
        const singalObject: SignalPayload = {
          objectType: "residenza",
          eserviceId,
          objectId,
          signalId,
          signalType: "DELETE",
        };
        await SHService.sendSignal(singalObject);

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
