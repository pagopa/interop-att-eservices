import {
  logger,
  authenticationCorrelationMiddleware,
  ExpressContext,
  ZodiosContext,
  TrialService,
} from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import FiscalcodeVerificationController from "../controllers/fiscalcodeVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { verifyCertValidity } from "../security/certValidityMiddleware.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";
import { keychainSignatureUtility } from "../utilities/keychainSignatureUtility.js";
import { keychainSignerConfig } from "../config/keychainSignerConfig.js";

const fiscalcodeVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);

  fiscalcodeVerificationRouter.post(
    "/subject-id-verification/check",
    // logHeadersMiddleware,
    contextDataFiscalCodeMiddleware,
    authenticationCorrelationMiddleware(true),
    verifyCertValidity,
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.idSubject}`);
        const data = await FiscalcodeVerificationController.findFiscalcode(
          req.body
        );
        void TrialService.insert(
          req.url,
          req.method,
          "FISCALCODE_VERIFICATION",
          "OK"
        );
        logger.info(`[END] Post - '/verifica'`);
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
          "FISCALCODE_VERIFICATION",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  fiscalcodeVerificationRouter.post(
    "/subject-id-verification/check-with-payload-signature",
    // logHeadersMiddleware,
    contextDataFiscalCodeMiddleware,
    authenticationCorrelationMiddleware(true),
    verifyCertValidity,
    async (req, res) => {
      try {
        const keychainConfig = keychainSignerConfig();
        const signatureUtility = new keychainSignatureUtility(
          keychainConfig.kmsKeychainKeyId
        );

        logger.info(
          `[START] Post - '/check-with-payload-signature' : ${req.body.idSubject}`
        );
        const data = await FiscalcodeVerificationController.findFiscalcode(
          req.body
        );
        void TrialService.insert(
          req.url,
          req.method,
          "FISCALCODE_VERIFICATION",
          "OK"
        );
        // TODO: INSERT HEADERS
        logger.info(`[END] Post - '/check-with-payload-signature' `);
        const signature = await signatureUtility.signData(JSON.stringify(data));
        res.setHeader("x-payload-signature", signature);
        res.setHeader("x-payload-signature-kid", keychainConfig.KeychainKeyId);
        res.setHeader("x-payload-signature-algorythm", "SHA256withRSA");

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
          "FISCALCODE_VERIFICATION",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return fiscalcodeVerificationRouter;
};

export default fiscalcodeVerificationRouter;
