import { logger, digitalAddressService, userService } from "pdnd-common";
import { fiscalcodeNotFound } from "../exceptions/errors.js";
import {
  ResponseRequestDigitalAddress,
  ResponseVerifyDigitalAddress,
} from "../model/domain/models.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";
import { digitalAddressVerificationConfig } from "../config/config.js";

class DigitalAddressVerificationSingleController {
  public async verify(
    idSubject: string,
    digitalAddressInput: string,
    from: string
  ): Promise<ResponseVerifyDigitalAddress> {
    try {
      const richiesta =
        await digitalAddressService.findSingleDataPreparationByFiscalCode(
          idSubject
        );
      /* eslint-disable */
      if (richiesta) {
        const foundItem = richiesta.digitalAddress.find(
          (richiesta) => richiesta.digitalAddress === digitalAddressInput,
        );
        if (foundItem) {
          if (richiesta.from <= from) {
            const result: ResponseVerifyDigitalAddress = {
              result: true,
              timestampCheck: new Date().toISOString(),
            };
            return result;
          }
        }
      } /* eslint-enable */
      const result: ResponseVerifyDigitalAddress = {
        result: false,
        timestampCheck: new Date().toISOString(),
      };
      return result;
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
        digitalAddressVerificationConfig
      );
    } catch (error) {
      logger.error(`Controller Error during getRotatedSeed`, error);
      throw error;
    }
  }

  public async extract(
    idSubject: string
  ): Promise<ResponseRequestDigitalAddress> {
    try {
      const richiesta =
        await digitalAddressService.findSingleDataPreparationByFiscalCode(
          idSubject
        );
      if (richiesta) {
        return responseRequestDigitalAddressModelToResponseRequestDigitalAddress(
          richiesta
        );
      } else {
        throw fiscalcodeNotFound(`The fiscal code not found: ${idSubject}`);
      }
    } catch (error) {
      logger.error(
        `Error during in method controller 'findFiscalcode': `,
        error
      );
      throw error;
    }
  }
}
export default new DigitalAddressVerificationSingleController();
