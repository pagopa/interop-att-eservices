import { logger, getContext, digitalAddress } from "pdnd-common";
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
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import {
  getMaxNumber,
  getStatusFromNumber,
} from "../utilities/statusRequestUtility.js";
import { parseJsonToRequestListDigitalAddress } from "../utilities/jsonDigitalAddressUtilities.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";
import { calculateUpdatedRequestState } from "../utilities/simulationUtils.js";

class DigitalAddressVerificationSingleController {
  public appContext = getContext();

  public async saveRequest(
    request: RequestListDigitalAddress
  ): Promise<ResponseRequestListDigitalAddress> {
    try {
      if (request.idSubjects) {
        const jsonRequest = JSON.stringify(request);
        const count = getMaxNumber();

        const verifyRequestInstance = new VerifyRequest(
          request.idRequest,
          jsonRequest,
          count
        );

        await digitalAddress.saveVerificationRequest(verifyRequestInstance);

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

  public async verify(
    idRichiesta: string
  ): Promise<ResponseStatusListDigitalAddress> {
    logger.info(
      `[CONTROLLER] Avvio verifica e simulazione per richiesta: ${idRichiesta}`
    );
    try {
      const originalRequest = await digitalAddress.findVerificationRequestById(
        idRichiesta
      );

      if (!originalRequest) {
        logger.warn(
          `[CONTROLLER] Richiesta non trovata con id: ${idRichiesta}`
        );
        throw requestVerificationNotFountError(
          `The request verification not found with id: ${idRichiesta}`
        );
      }

      const finalRequestState = calculateUpdatedRequestState(originalRequest);

      if (finalRequestState !== originalRequest) {
        logger.info(
          `[CONTROLLER] Aggiornamento stato per ${idRichiesta}. Nuovo conteggio: ${finalRequestState.count}`
        );
        await digitalAddress.updateVerificationRequest(finalRequestState);
      } else {
        logger.info(
          `[CONTROLLER] Nessun aggiornamento necessario per ${idRichiesta}. Conteggio: ${finalRequestState.count}`
        );
      }
      const result: ResponseStatusListDigitalAddress = {
        status: getStatusFromNumber(finalRequestState.count),
        message: getStatusFromNumber(finalRequestState.count),
      };
      return result;
    } catch (error) {
      logger.error(
        `[CONTROLLER] Errore nel metodo 'verify' per id ${idRichiesta}: `,
        error
      );
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
      const richiesta = await digitalAddress.findVerificationRequestById(idRichiesta);
      if (richiesta?.count == 1) {
        const requestListDigitalAddress = parseJsonToRequestListDigitalAddress(
          richiesta.jsonRequest
        );
        if (requestListDigitalAddress) {
          for (const idSubject of requestListDigitalAddress.idSubjects) {
            const addressModel = await digitalAddress.findSingleDataPreparationByFiscalCode(
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
