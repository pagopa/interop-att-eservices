import {
  logger,
  ExpressContext,
  ZodiosContext,
  authenticationCorrelationMiddleware,
  TrialService,
  auditValidationMiddleware,
  integrityValidationMiddleware,
  getEserviceIdFromToken,
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
    authenticationCorrelationMiddleware(true),
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
    authenticationCorrelationMiddleware(true),
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
  familyStatusRouter.get(
    "/family-status/pseudonymization",
    async (req, res) => {
      try {
        logger.info(`[START] pseudonymization GET`);
        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("Token PDND non trovato nella richiesta.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);

        const seed = await familyStatusController.getRotatedSeed(eserviceId);
        const cryptoHashFunction = "sha256";
        const response = {
          seed,
          cryptoHashFunction,
        };
        void TrialService.insert(
          req.url,
          req.method,
          "PSEUDONYMIZATION_001",
          "OK"
        );

        logger.info(`[END] pseudonymization GET`);
        return res.status(200).json(response).end();
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
          "PSEUDONYMIZATION_001",
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
