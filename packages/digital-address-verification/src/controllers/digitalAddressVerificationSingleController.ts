import { logger, getContext } from "pdnd-common";
import { fiscalcodeNotFound } from "../exceptions/errors.js";
import {
  ResponseRequestDigitalAddress,
  ResponseVerifyDigitalAddress,
} from "../model/domain/models.js";
import DataPreparationService from "../services/dataPreparationService.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";

class DigitalAddressVerificationSingleController {
  public appContext = getContext();

  public async verify(
    idSubject: string,
    digitalAddress: string,
    from: string
  ): Promise<ResponseVerifyDigitalAddress> {
    try {
      const richiesta = await DataPreparationService.findByFiscalCode(
        idSubject
      );
      /* eslint-disable */
      if (richiesta) {
        const foundItem = richiesta.digitalAddress.find(
          (richiesta) => richiesta.digitalAddress === digitalAddress
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

  // Response_Status_List_Digital_Address
  public async extract(
    idSubject: string // Response_Request_Digital_Address
  ): Promise<ResponseRequestDigitalAddress> {
    try {
      const richiesta = await DataPreparationService.findByFiscalCode(
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
