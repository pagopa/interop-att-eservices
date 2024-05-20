import { ExpressContext, getContext, logger } from "pdnd-common";
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import DataPreparationHandshakeService from "../services/dataPreparationHandshakeService.js";
import {
  certNotValidError,
  requestParamNotValid,
} from "../exceptions/errors.js";
import { getCertificateFingerprintFromString } from "../utilities/certificateUtility.js";

export const verifyCertValidity: ZodiosRouterContextRequestHandler<
  ExpressContext
> = async (req, res, next) => {
  // Verifica se è stato caricato un file
  const headerCert = Array.isArray(req.headers["x-amzn-mtls-clientcert"])
  ? req.headers["x-amzn-mtls-clientcert"][0]
  : req.headers["x-amzn-mtls-clientcert"] ?? null

  if (!headerCert) {
    logger.error("Nessun certificato caricato");
    throw certNotValidError(`mandatory certificate`);
  }

  const apiKey: string | undefined = req.headers.apikey as string | undefined;
  if (!apiKey) {
    logger.error("'Header apikey mandatory.'");
    throw requestParamNotValid(`missing header`);
  }

  const serialNumber = getCertificateFingerprintFromString(headerCert);
  try {
    const appContext = getContext();
    const handshake = await DataPreparationHandshakeService.getByPurposeId(
      appContext.authData.purposeId
    );
    if (handshake?.cert !== serialNumber) {
      throw certNotValidError(`Il certificato non è valido.`);
    }
    if (handshake?.apikey !== apiKey) {
      throw certNotValidError(`apiKey non è valido.`);
    }
    next(); // Chiamare next solo se il certificato è valido
  } catch (error) {
    logger.error(
      `Si è verificato un errore durante la verifica della validità del certificato: ${error}`
    );
    // Gestisci gli errori di verifica del certificato
    res
      .status(500)
      .send(
        "Si è verificato un errore durante la verifica della validità del certificato."
      );
  }
};
