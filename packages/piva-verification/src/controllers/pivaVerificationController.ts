import { logger, PivaVerificationService, userService } from "pdnd-common";
import { Richiesta, VerificaPartitaIva } from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import { pivaVerificationConfig } from "../config/config.js";

class PivaVerificationController {
  public async findPiva(request: Richiesta): Promise<VerificaPartitaIva> {
    try {
      if (request.organizationId) {
        const data = await PivaVerificationService.getByPiva(
          request.organizationId
        );
        const result: VerificaPartitaIva = {
          data,
        };
        return result;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findPiva': `, error);
      throw error;
    }
  }
  public async getRotatedSeed(eserviceId: string): Promise<string> {
    try {
      return await userService.generateSeed(eserviceId, pivaVerificationConfig);
    } catch (error) {
      logger.error(`Controller Error during getRotatedSeed`, error);
      throw error;
    }
  }
}

export default new PivaVerificationController();
