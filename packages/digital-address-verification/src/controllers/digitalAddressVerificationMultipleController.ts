import { logger, getContext } from "pdnd-common";
import {
  requestParamNotValid,
  requestVerificationNotFountError,
} from "../exceptions/errors.js";
import {
  RequestListDigitalAddress,
  ResponseListDigitalAddress,
  ResponseRequestListDigitalAddress,
  ResponseStatusListDigitalAddress,
} from "../model/domain/models.js";
import DigitalAddressVerificationService from "../services/digitalAddressVerificationService.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import {
  getMaxNumber,
  getStatusFromNumber,
} from "../utilities/statusRequestUtility.js";
import dataPreparationService from "../services/dataPreparationService.js";
import { parseJsonToRequestListDigitalAddress } from "../utilities/jsonDigitalAddressUtilities.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";

class DigitalAddressVerificationSingleController {
  public appContext = getContext();

  public async saveRequest(
    request: RequestListDigitalAddress
  ): Promise<ResponseRequestListDigitalAddress> {
    try {
      if (request.codiciFiscali) {
        const jsonRequest = JSON.stringify(request);
        const count = getMaxNumber(); // presa in carico

        const verifyRequestInstance = new VerifyRequest(jsonRequest, count);

        await DigitalAddressVerificationService.saveAll(verifyRequestInstance);

        const result: ResponseRequestListDigitalAddress = {
          state: getStatusFromNumber(count),
          message: getStatusFromNumber(count),
          id: verifyRequestInstance.idRequest,
          requestTimestamp: new Date().toISOString(),
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

  // Response_Status_List_Digital_Address
  public async verify(
    idRichiesta: string
  ): Promise<ResponseStatusListDigitalAddress> {
    try {
      const richiesta =
        await DigitalAddressVerificationService.simulateWorkByIdRequest(
          idRichiesta
        );
      if (richiesta) {
        const result: ResponseStatusListDigitalAddress = {
          status: getStatusFromNumber(richiesta.count),
          message: getStatusFromNumber(richiesta.count),
        };
        return result;
      } else {
        throw requestVerificationNotFountError(
          `The request verification not found with id: ${idRichiesta}`
        );
      }
    } catch (error) {
      logger.error(`Error during in method controller 'verify': `, error);
      throw error;
    }
  }

  /* eslint-disable */
  public async getByIdRequest(
    idRichiesta: string
  ): Promise<ResponseListDigitalAddress> {
    const responseListDigitalAddress: ResponseListDigitalAddress = {
      list: [],
    };
    try {
      const richiesta = await DigitalAddressVerificationService.getByIdRequest(
        idRichiesta
      );
      if (richiesta?.count == 1) {
        const requestListDigitalAddress = parseJsonToRequestListDigitalAddress(
          richiesta.jsonRequest
        );
        if (requestListDigitalAddress) {
          for (const idSubject of requestListDigitalAddress.idSubjects) {
            const addressModel = await dataPreparationService.findByFiscalCode(
              idSubject
            );
            if (addressModel) {
              const address =
                responseRequestDigitalAddressModelToResponseRequestDigitalAddress(
                  addressModel
                );
              responseListDigitalAddress.list.push(address);
            }
          }
        }
      } else {
        throw requestVerificationNotFountError(
          `The request verification not found with id: ${idRichiesta}`
        );
      }
      return responseListDigitalAddress;
    } catch (error) {
      logger.error(
        `Error during in method controller 'findFiscalcode': `,
        error
      );
      throw error;
    }
  } /* eslint-enable */
}
export default new DigitalAddressVerificationSingleController();
