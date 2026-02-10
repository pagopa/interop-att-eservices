import { logger, FiscalCodeService, userService } from "pdnd-common";
import { Richiesta, VerificaCodiceFiscale } from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import { fiscalcodeModelToVerificaCodiceFiscale } from "../model/domain/apiConverter.js";
import { fiscalcodeVerificationConfig } from "../config/config.js";

class FiscalcodeVerificationController {
  public async findFiscalcode(
    request: Richiesta
  ): Promise<VerificaCodiceFiscale> {
    try {
      if (request.idSubject) {
        const foundFiscalCode = await FiscalCodeService.getByFiscalCode(
          request.idSubject
        );

        const data = foundFiscalCode
          ? fiscalcodeModelToVerificaCodiceFiscale(
              foundFiscalCode,
              true,
              "Codice fiscale valido"
            )
          : fiscalcodeModelToVerificaCodiceFiscale(
              null,
              false,
              "Codice fiscale non valido",
              request.idSubject
            );

        const result: VerificaCodiceFiscale = {
          data,
        };
        return result;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
    } catch (error) {
      logger.error(
        `Error during in method controller 'findFiscalcode': `,
        error
      );
      throw error;
    }
  }

  public async getRotatedSeed(eserviceId: string): Promise<string> {
    try {
      return await userService.generateSeed(
        eserviceId,
        fiscalcodeVerificationConfig
      );
    } catch (error) {
      logger.error(`Controller Error during getRotatedSeed`, error);
      throw error;
    }
  }
}

export default new FiscalcodeVerificationController();
