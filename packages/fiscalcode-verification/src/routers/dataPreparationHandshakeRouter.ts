import {  ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext, logger } from "pdnd-common";
import multer from 'multer';
import { api } from "../model/generated/api.js";
import dataPreparationHandshakeService from "../services/dataPreparationHandshakeService.js";
import { getContext } from "pdnd-common";
import { contextDataMiddleware } from "pdnd-common";
import { authenticationMiddleware } from "pdnd-common";
import { certNotValidError, makeApiProblem, requestParamNotValid } from "../exceptions/errors.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { createCertificateHash } from "../utilities/certificateUtility.js";



const dataPreparationHandshakeRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {

  const dataPreparationHandshakeRouter = ctx.router(api.api);

  const upload = multer({ storage: multer.memoryStorage() });

  
  dataPreparationHandshakeRouter.post('/fiscalcode-verification/data-preparation/handshake', 
  contextDataMiddleware,authenticationMiddleware(), upload.single('certificate'), 
  async (req, res) =>  {
    try {
    // Verifica se è stato caricato un file
    if (!req.file) {
      logger.error("Nessun certificato caricato")
      throw certNotValidError(
        `mandatory certificate`
      );
    }
  
    const apiKey: string | undefined = req.headers['apikey'] as string | undefined;     
    if (!apiKey) {
        logger.error("'Header apikey mandatory.'")
        throw requestParamNotValid(
          `missing header`
        );
    }
    // Il certificato sarà accessibile tramite req.file.buffer
    const certificateData: Buffer = req.file.buffer;
    
    const serialNumber = createCertificateHash(certificateData);
    const handshakeData = {
      pourposeId:  getContext().authData.purposeId,
      apikey: apiKey,
      cert: serialNumber,
    };
  
    await dataPreparationHandshakeService.saveList(handshakeData);
    logger.info ("certificato salvato con successo")  
    return res.status(200).end();
    }  catch (error) {
      // Gestione dell'errore
      console.error("Si è verificato un errore durante l'upload dell'handshake:", error);
      const errorRes = makeApiProblem(error, createEserviceDataPreparation);
      return res.status(errorRes.status).json(errorRes).end();
    }
  }
);

  return dataPreparationHandshakeRouter;
};
export default dataPreparationHandshakeRouter;
