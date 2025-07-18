import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import { authenticationCorrelationMiddleware, TrialService } from "pdnd-common";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataKeychainMockMiddleware } from "../context/context.js";
import { keychainSignatureUtility } from "../utilities/keychainSignatureUtility.js";
import { keychainSignerConfig } from "../config/keychainSignerConfig.js";
import { api } from "../model/generated/api.js";

const keychainMockRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const keychainMockRouter = ctx.router(api.api);

  keychainMockRouter.get(
    "/keychain-mock/signature",
    // logHeadersMiddleware,
    contextDataKeychainMockMiddleware,
    authenticationCorrelationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Get - '/keychain-mock/signature' `);
        const keychainConfig = keychainSignerConfig();
        const signatureUtility = new keychainSignatureUtility(
          keychainConfig.kmsKeychainKeyId
        );

        const responseBody = {
          message: "risposta generata con successo",
        };

        const signature = await signatureUtility.signData(
          JSON.stringify(responseBody)
        );

        res.setHeader("x-payload-signature", signature);
        res.setHeader("x-payload-signature-kid", keychainConfig.KeychainKeyId);
        res.setHeader("x-payload-signature-algorythm", "SHA256withRSA");
        void TrialService.insert(
          req.url,
          req.method,
          "KEYCHAIN_MOCK_SIGNATURE",
          "OK"
        );
        logger.info(`[END] Get - '/keychain-mock/signature'`);
        return res.status(200).json(responseBody).end();
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
          "KEYCHAIN_MOCK_SIGNATURE",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  keychainMockRouter.post(
    "/keychain-mock/verify",
    // logHeadersMiddleware,
    contextDataKeychainMockMiddleware,
    authenticationCorrelationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/keychain-mock/verify'`);
        // Recupera il valore dell'header X-Payload-Signature
        const payloadSignature = req.headers["x-payload-signature"];

        // Controlla se l'header è presente
        if (!payloadSignature) {
          logger.error(`[ERROR] X-Payload-Signature header is missing.`);
          const responseBodyError = {
            status: "KO",
            message: "X-Payload-Signature header is missing",
          };
          // Solleva un errore 500 se l'header non è presente
          return res.status(200).json(responseBodyError).end();
        }

        const responseBody = {
          status: "OK",
          message: "X-Payload-Signature verificata",
        };
        void TrialService.insert(
          req.url,
          req.method,
          "KEYCHAIN_MOCK_VERIFY",
          "OK"
        );
        logger.info(`[END] Post - '/keychain-mock/verify'`);
        return res.status(200).json(responseBody).end();
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
          "KEYCHAIN_MOCK_VERIFY",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );
  return keychainMockRouter;
};

export default keychainMockRouter;
