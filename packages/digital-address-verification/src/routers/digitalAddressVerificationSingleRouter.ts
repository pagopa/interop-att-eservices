import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {
  authenticationMiddleware,
  uniquexCorrelationIdMiddleware,
} from "pdnd-common";
import { TrialService } from "trial";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataDigitalAddressMiddleware } from "../context/context.js";
import digitalAddressVerificationSingleController from "../controllers/digitalAddressVerificationSingleController.js";
const DigitalAddressVerificationSingleRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const digitalAddressVerificationSingleRouter = ctx.router(api.api);

  digitalAddressVerificationSingleRouter.get(
    "/digital-address-verification/verify/:codice_fiscale",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body}`);
        const { codice_fiscale } = req.params;
        const { digital_address, since, practicalReference } = req.query;
        logger.info(practicalReference);
        const result = await digitalAddressVerificationSingleController.verify(
          codice_fiscale,
          digital_address,
          since
        );
        void TrialService.insert(
          req.url,
          req.method,
          "DIGITAL_ADDRESS_VERIFICATION_VERIFY",
          "OK"
        );
        logger.info(`[END] Post - '/verifica'`);
        return res.status(200).json(result).end();
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
          "DIGITAL_ADDRESS_VERIFICATION_VERIFY",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  digitalAddressVerificationSingleRouter.get(
    "/digital-address-verification/extract/:codice_fiscale",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        const { codice_fiscale } = req.params;
        const { practicalReference } = req.query;
        logger.info(practicalReference);
        logger.info(`[START] Post - '/verifica' : ${codice_fiscale}`);
        const result = await digitalAddressVerificationSingleController.extract(
          codice_fiscale
        );
        void TrialService.insert(
          req.url,
          req.method,
          "DIGITAL_ADDRESS_VERIFICATION_EXTRACT",
          "OK"
        );
        logger.info(`[END] Post - '/verifica'`);
        return res.status(200).json(result).end();
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
          "DIGITAL_ADDRESS_VERIFICATION_EXTRACT",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  return digitalAddressVerificationSingleRouter;
};

export default DigitalAddressVerificationSingleRouter;
