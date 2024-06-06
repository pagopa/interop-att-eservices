import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {
  authenticationMiddleware,
  uniquexCorrelationIdMiddleware,
} from "pdnd-common";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";
import { contextDataDigitalAddressMiddleware } from "../context/context.js";
import digitalAddressVerificationMultipleController from "../controllers/digitalAddressVerificationMultipleController.js";
import { TrialService } from "trial";


const DigitalAddressVerificationMultipleRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const digitalAddressVerificationMultipleRouter = ctx.router(api.api);

  digitalAddressVerificationMultipleRouter.post(
    "/digital-address-verification/listDigitalAddress",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body.codiciFiscali}`);
        const response =
          await digitalAddressVerificationMultipleController.saveRequest(
            req.body
          );
        logger.info(`[END] Post - '/verifica'`);
        const locationBaseHost = `${req.protocol}://${req.get('host')}`;
        res.set(
          "Location",
          locationBaseHost +
            `/digital-address-verification/listDigitalAddress/state/${response.id}`
        );
        void TrialService.insert(
          req.url,
          req.method,
          "DIGITAL_ADDRESS_VERIFICATION_LIST",
          "OK"
        );
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
          "DIGITAL_ADDRESS_VERIFICATION_LIST",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  digitalAddressVerificationMultipleRouter.get(
    "/digital-address-verification/listDigitalAddress/state/:id",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.params.id}`);
        const response =
          await digitalAddressVerificationMultipleController.verify(
            req.params.id
          );
        logger.info(`[END] Post - '/verifica'`);
        /* eslint-disable */
        if (response.state == "DISPONIBILE") {
          /* eslint-enable */
          const locationBaseHost = `${req.protocol}://${req.get('host')}`;
          res.set(
            "Location",
            locationBaseHost +
              `/digital-address-verification/listDigitalAddress/response/${req.params.id}`
          );
          void TrialService.insert(
            req.url,
            req.method,
            "DIGITAL_ADDRESS_VERIFICATION_LIST_STATE",
            "OK"
          );
          return res.status(200).json(response).end();
        }
        void TrialService.insert(
          req.url,
          req.method,
          "DIGITAL_ADDRESS_VERIFICATION_LIST_STATE",
          "OK"
        );
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
          "DIGITAL_ADDRESS_VERIFICATION_LIST_STATE",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  digitalAddressVerificationMultipleRouter.get(
    "/digital-address-verification/listDigitalAddress/response/:id",
    // logHeadersMiddleware,
    contextDataDigitalAddressMiddleware,
    uniquexCorrelationIdMiddleware(),
    authenticationMiddleware(true),
    async (req, res) => {
      try {
        logger.info(`[START] Post - '/verifica' : ${req.body}`);

        const response =
          await digitalAddressVerificationMultipleController.getByIdRequest(
            req.params.id
          );

        void TrialService.insert(
          req.url,
          req.method,
          "DIGITAL_ADDRESS_VERIFICATION_LIST_RESPONSE",
          "OK"
        );
        logger.info(`[END] Post - '/verifica'`);
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
          "DIGITAL_ADDRESS_VERIFICATION_LIST_RESPONSE",
          "KO",
          JSON.stringify(generalErrorResponse)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  return digitalAddressVerificationMultipleRouter;
};

export default DigitalAddressVerificationMultipleRouter;
