/* eslint-disable @typescript-eslint/no-floating-promises */
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  logger,
  ExpressContext,
  ZodiosContext,
  TrialService,
  getEserviceIdFromToken,
} from "pdnd-common";
import ResidenceVerificationController from "../controllers/residenceVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, mapGeneralErrorModel } from "../exceptions/errors.js";

const residenceVerificationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceVerificationRouter = ctx.router(api.api);

  residenceVerificationRouter.post(
    "/residence-verification/check",
    async (req, res) => {
      try {
        const data = await ResidenceVerificationController.findUserVerify(
          req.body
        );
        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_VERIFICATION_002",
          "OK"
        );
        logger.info(`[END] Verify ResidenceVerificationRouter`);
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
          "RESIDENCE_VERIFICATION_002",
          "KO",
          JSON.stringify(generalErrorResponse).substring(0, 500)
        );
        return res.status(errorRes.status).json(generalErrorResponse).end();
      }
    }
  );

  residenceVerificationRouter.get(
    "/residence-verification/pseudonymization",
    async (req, res) => {
      try {
        logger.info(`[START] pseudonymization GET`);
        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("Token PDND non trovato nella richiesta.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);

        const seed = await ResidenceVerificationController.getRotatedSeed(
          eserviceId
        );
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
  return residenceVerificationRouter;
};
export default residenceVerificationRouter;
