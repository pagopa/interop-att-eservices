import { ExpressContext, getContext, logger } from "pdnd-common";
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { match } from "ts-pattern";
import DataPreparationHandshakeService from "../services/dataPreparationHandshakeService.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { getSerialNumberFromUrlEncodedCert } from "../utilities/certificateUtility.js";
import { ErrorHandling } from "../../../models/dist/errorHandling.js";

export const verifyCertValidity: ZodiosRouterContextRequestHandler<
  ExpressContext
> = async (req, res, next) => {
  try {
    // Verifica se è stato caricato un file
    const headerCert = Array.isArray(req.headers["x-amzn-mtls-clientcert"])
      ? req.headers["x-amzn-mtls-clientcert"][0]
      : req.headers["x-amzn-mtls-clientcert"] ?? null;

    if (!headerCert) {
      logger.error("Nessun certificato caricato");
      throw ErrorHandling.certificateNotValidError();
    }

    const apiKey: string | undefined = req.headers.apikey as string | undefined;
    if (!apiKey) {
      logger.error("Header apikey mandatory.");
      throw ErrorHandling.apikeyNotValidError();
    }

    const serialNumber = getSerialNumberFromUrlEncodedCert(headerCert);

    const appContext = getContext();
    const handshake = await DataPreparationHandshakeService.getByPurposeId(
      appContext.authData.purposeId
    );

    if (handshake?.cert !== serialNumber) {
      logger.error(`Certificato non valido`);
      throw ErrorHandling.certificateNotValidError();
    }
    next(); // Chiamare next solo se il certificato è valido
  } catch (error) {
    logger.error(
      `Si è verificato un errore durante la verifica della validità del certificato: ${error}`
    ); /* eslint-disable */
    const problem = makeApiProblem(error, (err: { code: any }) =>
      match(err.code)
        .with("unauthorizedError", () => 401)
        .with("operationForbidden", () => 403)
        .with("missingHeader", () => 400)
        .with("certNotValid", () => 401)
        .with("apikeyNotValid", () => 400)
        .otherwise(() => 500)
    ); /* eslint-enable */
    res.status(problem.status).json(problem).end();
  }
};
