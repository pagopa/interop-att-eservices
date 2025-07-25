import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import {
  DataPreparationHandshakeService,
  ExpressContext,
  ZodiosContext,
  logger,
} from "pdnd-common";
import multer from "multer";
import { authenticationMiddleware } from "pdnd-common";
import { api } from "../model/generated/api.js";
import {
  certNotValidError,
  makeApiProblem,
  requestParamNotValid,
} from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { getCertificateFingerprintFromBuffer } from "../utilities/certificateUtility.js";
import { contextDataFiscalCodeMiddleware } from "../context/context.js";

const dataPreparationHandshakeRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const dataPreparationHandshakeRouter = ctx.router(api.api);

  const upload = multer({ storage: multer.memoryStorage() });

  dataPreparationHandshakeRouter.post(
    "/subject-id-verification/data-preparation/handshake",
    contextDataFiscalCodeMiddleware,
    authenticationMiddleware(false),
    upload.single("certificate"),
    async (req, res) => {
      try {
        // Verifica se è stato caricato un file
        if (!req.file) {
          logger.error("Nessun certificato caricato");
          throw certNotValidError(`mandatory certificate`);
        }

        const apiKey: string | undefined = req.headers.apikey as
          | string
          | undefined;
        if (!apiKey) {
          logger.error("'Header apikey mandatory.'");
          throw requestParamNotValid(`missing header`);
        }
        // Il certificato sarà accessibile tramite req.file.buffer
        const certificateData: Buffer = req.file.buffer;

        const serialNumber =
          getCertificateFingerprintFromBuffer(certificateData);
        const handshakeData = {
          apikey: apiKey,
          cert: serialNumber,
        };
        logger.info(`cert: ${handshakeData.cert}`);

        await DataPreparationHandshakeService.saveList(handshakeData);
        logger.info("certificato salvato con successo");
        return res.status(200).end();
      } catch (error) {
        // Gestione dell'errore
        logger.error(
          `si è verificato un errore durante l upload dell certificato: ${error}`
        );
        const errorRes = makeApiProblem(error, createEserviceDataPreparation);
        return res.status(errorRes.status).json(errorRes).end();
      }
    }
  );

  return dataPreparationHandshakeRouter;
};
export default dataPreparationHandshakeRouter;
