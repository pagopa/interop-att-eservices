import { ExpressContext, getContext, logger } from "pdnd-common";
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import DataPreparationHandshakeService from "../services/dataPreparationHandshakeService.js";
import {
  certNotValidError,
  requestParamNotValid,
} from "../exceptions/errors.js";
import { createCertificateHash } from "../utilities/certificateUtility.js";

export const verifyCertValidity: ZodiosRouterContextRequestHandler<
  ExpressContext
> = async (req, res, next) => {
  // Verifica se è stato caricato un file
  if (!req.file) {
    logger.error("Nessun certificato caricato");
    throw certNotValidError(`mandatory certificate`);
  }

  const apiKey: string | undefined = req.headers.apikey as string | undefined;
  if (!apiKey) {
    logger.error("'Header apikey mandatory.'");
    throw requestParamNotValid(`missing header`);
  }
  // Il certificato sarà accessibile tramite req.file.buffer
  const certificateData: Buffer = req.file.buffer;

  const serialNumber = createCertificateHash(certificateData);
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
