import {
  logger,
  ExpressContext,
  ZodiosContext,
  authenticationCorrelationMiddleware,
  TrialService,
  auditValidationMiddleware,
  integrityValidationMiddleware,
} from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  makeApiProblem,
  mapGeneralErrorModel,
  userModelNotFound,
} from "../exceptions/errors.js";
import { contextDataFamilyMiddleware } from "../context/context.js";
import familyStatusController from "../controllers/familyStatusController.js";
import { keychainSignatureUtility } from "../utilities/keychainSignatureUtility.js";
import { keychainSignerConfig } from "../config/keychainSignerConfig.js";
import { familyStatusConfiguration } from "../config/config.js";

const familyStatusRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const familyStatusRouter = ctx.router(api.api);

  familyStatusRouter.post(
    "/family-status",
    contextDataFamilyMiddleware,
    authenticationCorrelationMiddleware(true, familyStatusConfiguration),
    integrityValidationMiddleware(familyStatusConfiguration),
    auditValidationMiddleware(familyStatusConfiguration),
    async (req, res) => {
      try {
        logger.info(`[START] familyStatusRouter: ${req.body}`);
        const data = await familyStatusController.findUser(req.body);
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(req.url, req.method, "FAMILY_STATUS", "OK");
        logger.info(`[END] familyStatusRouter`);
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
          "FAMILY_STATUS",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  familyStatusRouter.post(
    "/family-status/check-with-payload-signature",
    contextDataFamilyMiddleware,
    authenticationCorrelationMiddleware(true, familyStatusConfiguration),
    integrityValidationMiddleware(familyStatusConfiguration),
    auditValidationMiddleware(familyStatusConfiguration),
    async (req, res) => {
      try {
        logger.info(`[START] familyStatusRouter: ${req.body}`);
        const keychainConfig = keychainSignerConfig();
        const signatureUtility = new keychainSignatureUtility(
          keychainConfig.kmsKeychainKeyId
        );
        const data = await familyStatusController.findUser(req.body);
        if (!data || data.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        void TrialService.insert(req.url, req.method, "FAMILY_STATUS", "OK");
        const signature = await signatureUtility.signData(JSON.stringify(data));
        res.setHeader("x-payload-signature", signature);
        res.setHeader(
          "x-payload-signature-kid",
          keychainConfig.kmsKeychainKeyId
        );
        res.setHeader("x-payload-signature-algorythm", "SHA256withRSA");
        logger.info(`[END] familyStatusRouter`);
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
          "FAMILY_STATUS",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return familyStatusRouter;
};
export default familyStatusRouter;
