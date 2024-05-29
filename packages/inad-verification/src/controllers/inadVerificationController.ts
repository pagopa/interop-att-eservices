import { logger, getContext } from "pdnd-common";
import FiscalcodeVerificationService from "../services/fiscalcodeVerificationService.js";
import { Richiesta, VerificaCodiceFiscale } from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";

class FiscalcodeVerificationController {
  public appContext = getContext();

  public async findFiscalcode(
    request: Richiesta
  ): Promise<VerificaCodiceFiscale> {
    try {
      if (request.codiceFiscale) {
        const data = await FiscalcodeVerificationService.getByFiscalCode(
          request.codiceFiscale
        );
        const result: VerificaCodiceFiscale = {
          // idOperazione: request.idOperazioneClient,
          data,
        };
        return result;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findFiscalcode': `, error);
      throw error;
    }
  }
}

export default new FiscalcodeVerificationController();
