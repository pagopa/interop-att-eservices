import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  ExpressContext,
  ZodiosContext,
  FiscalCodeService,
  logger,
  authenticationMiddleware,
  SHService,
  getEserviceIdFromToken,
  HashAlgorithm,
  generateObjectId,
  getPDNDTokenM2M,
  SignalPayload,
  TrialService,
} from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { api } from "../model/generated/api.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import {
  apiFiscalcodeModelToDataPreparationResponse,
  apiDatapreparationTemplateToFiscalcodeModel,
} from "../model/domain/apiConverter.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";
import { fiscalcodeVerificationConfig } from "../config/config.js"

const dataPreparationRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationRouter = ctx.router(api.api);

  dataPreparationRouter.post(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        await FiscalCodeService.saveList(
          apiDatapreparationTemplateToFiscalcodeModel(req.body)
        );
        return res.status(201).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.get(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        const data = await FiscalCodeService.getAll();
        const result =
          data != null ? apiFiscalcodeModelToDataPreparationResponse(data) : [];
        logger.info(result);
        return res.status(200).json(result).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  dataPreparationRouter.delete(
    "/subject-id-verification/data-preparation",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      try {
        if (!req) {
          throw ErrorHandling.invalidApiRequest();
        }
        await FiscalCodeService.deleteAllByKey();

        return res.status(204).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );
  /* eslint-disable */
  dataPreparationRouter.post(
    "/subject-id-verification/data-preparation/remove",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    async (req, res) => {
      /* eslint-enable */
      try {

        const fiscalCode = apiDatapreparationTemplateToFiscalcodeModel(req.body).fiscalCode

        await FiscalCodeService.deleteByFiscalCode(fiscalCode);
        const authHeader = req.headers.authorization;
        const pdndToken = authHeader?.split(" ")[1];
        if (!pdndToken) {
          throw new Error("PDND token not found in request.");
        }

        if (!fiscalCode) {
          throw new Error("Fiscal Code not found for 'objectId' generation.");
        }

        const eserviceId = await getEserviceIdFromToken(pdndToken);
        const seed = await SHService.findSeedByEserviceId(
          eserviceId,
          fiscalcodeVerificationConfig
        );
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
        const m2mToken = await getPDNDTokenM2M(fiscalcodeVerificationConfig);
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
        await SHService.sendSignal(
          signalObject,
          m2mToken,
          fiscalcodeVerificationConfig
        );

        void TrialService.insert(
          req.url,
          req.method,
          "RESIDENCE_SUBMISSION_001",
          "OK"
        );
        logger.info(`[END] residenceSubissionController delete`);

        return res.status(201).end();
      } catch (error) {
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  return dataPreparationRouter;
};
export default dataPreparationRouter;
