import { logger, getContext } from "pdnd-common";
import PivaVerificationService from "../services/pivaVerificationService.js";
import { Richiesta, VerificaPartitaIva } from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";

class PivaVerificationController {
  public appContext = getContext();

  public async findPiva(request: Richiesta): Promise<VerificaPartitaIva> {
    try {
      if (request.partitaIva) {
        const data = await PivaVerificationService.getByPiva(
          request.partitaIva
        );
        const result: VerificaPartitaIva = {
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
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }
}

export default new PivaVerificationController();
