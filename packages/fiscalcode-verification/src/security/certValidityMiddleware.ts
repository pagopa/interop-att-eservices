import { ExpressContext, getContext, logger } from "pdnd-common";
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import DataPreparationHandshakeService from "../services/dataPreparationHandshakeService.js";
import {
  makeApiProblem,
} from "../exceptions/errors.js";
import { getCertificateFingerprintFromString } from "../utilities/certificateUtility.js";
import { match } from "ts-pattern";
import { ErrorHandling } from "../../../models/dist/errorHandling.js";

export const verifyCertValidity: ZodiosRouterContextRequestHandler<
  ExpressContext
> = async (req, res, next) => {
  try {
  // Verifica se è stato caricato un file
  const headerCert = Array.isArray(req.headers["x-amzn-mtls-clientcert"])
  ? req.headers["x-amzn-mtls-clientcert"][0]
  : req.headers["x-amzn-mtls-clientcert"] ?? null

  if (!headerCert) {
    logger.error("Nessun certificato caricato");
    throw ErrorHandling.certificateNotValidError();  
  }
  
  logger.info (`verifyCertValidity: x-amzn-mtls-clientcert: ${headerCert}`) 
  const apiKey: string | undefined = req.headers.apikey as string | undefined;
  if (!apiKey) {
    logger.error('Header apikey mandatory.');
    throw ErrorHandling.apikeyNotValidError();
  }

  const serialNumber = getCertificateFingerprintFromString(headerCert);
  
    const appContext = getContext();
    const handshake = await DataPreparationHandshakeService.getByPurposeId(
      appContext.authData.purposeId
    );

    logger.info(`handshake.cert ${handshake?.cert}`);    
    logger.info(`serialNumber ${serialNumber}`);    

    
    if (handshake?.cert !== serialNumber) {
      logger.error(
        `Certificato non valido`
      );
      throw ErrorHandling.certificateNotValidError();
    } 
    if (handshake?.apikey !== apiKey) {
      logger.error(
        `apiKey non valida`
      );
      throw ErrorHandling.apikeyNotValidError();
    }
    next(); // Chiamare next solo se il certificato è valido
  } catch (error) {
    logger.error(
      `Si è verificato un errore durante la verifica della validità del certificato: ${error}`
    );
    const problem = makeApiProblem(error, (err: { code: any; }) =>
      match(err.code)
        .with("unauthorizedError", () => 401)
        .with("operationForbidden", () => 403)
        .with("missingHeader", () => 400)
        .with("certNotValid", () => 401)
        .with("apikeyNotValid", () => 500)
        .otherwise(() => 500)
    );
    res.status(problem.status).json(problem).end();

  }
};
