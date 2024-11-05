import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
// import { authenticationCorrelationMiddleware } from "pdnd-common";
import { TrialService } from "trial";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataKeychainMockMiddleware } from "../context/context.js";
import { keychainSignatureUtility } from "../utilities/keychainSignatureUtility.js";
import { keychainSignerConfig } from "../config/keychainSignerConfig.js";
import { api } from "../model/generated/api.js";

const fiscalcodeVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const fiscalcodeVerificationRouter = ctx.router(api.api);

  fiscalcodeVerificationRouter.get(
    "/keychain-mock/signature",
    // logHeadersMiddleware,
    contextDataKeychainMockMiddleware,
    // authenticationCorrelationMiddleware(true),
    async (req, res) => {
      try {
        const keychainConfig = keychainSignerConfig();
        const signatureUtility = new keychainSignatureUtility(
          keychainConfig.kmsKeychainKeyId
        );

        logger.info(`[START] Get - '/keychain-mock/signature' `);

        void TrialService.insert(
          req.url,
          req.method,
          "KEYCHAIN_MOCK_SIGNATURE",
          "OK"
        );
        // Dati originali
        const responseBody = {
          message: "risposta generata con successo",
        };

        logger.info(`[END] Get - '/keychain-mock/signature'`);
        const signature = await signatureUtility.signData(
          JSON.stringify(responseBody)
        );
        res.setHeader("x-payload-signature", signature);
        res.setHeader(
          "x-payload-signature-kid",
          keychainConfig.kmsKeychainKeyId
        );
        res.setHeader("x-payload-signature-algorythm", "SHA256withRSA");

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

  fiscalcodeVerificationRouter.post(
    "/keychain-mock/verify",
    // logHeadersMiddleware,
    contextDataKeychainMockMiddleware,
    // authenticationCorrelationMiddleware(true),
    async (req, res) => {
      try {
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
        logger.info(`[START] Post - '/keychain-mock/verify'`);

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
  return fiscalcodeVerificationRouter;
};

export default fiscalcodeVerificationRouter;
