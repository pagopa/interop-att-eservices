import { logger, getContext } from "pdnd-common";
import { requestParamNotValid } from "../exceptions/errors.js";
import { RequestListDigitalAddress, ResponseListDigitalAddress, ResponseRequestListDigitalAddress, ResponseStatusListDigitalAddress } from "../model/domain/models.js";
import DigitalAddressVerificationService from "../services/digitalAddressVerificationService.js"
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { getMaxNumber, getStatusFromNumber } from "../utilities/statusRequestUtility.js";
import dataPreparationService from "../services/dataPreparationService.js";
import { parseJsonToRequestListDigitalAddress } from "../utilities/jsonDigitalAddressUtilities.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";
class DigitalAddressVerificationSingleController {
  public appContext = getContext();

  //Request_List_Digital_Address
  //Response_Request_List_Digital_Address

  public async saveRequest(
    request: RequestListDigitalAddress
  ): Promise<ResponseRequestListDigitalAddress> {
    try {
      if (request.codiciFiscali) {

        const jsonRequest = JSON.stringify(request);
        const jsonResult = "";
        const count = getMaxNumber(); //presa in carico

        const verifyRequestInstance = new VerifyRequest(jsonRequest, count, jsonResult);
        await DigitalAddressVerificationService.saveAll(
          verifyRequestInstance
        );

        const result: ResponseRequestListDigitalAddress = {
          // idOperazione: request.idOperazioneClient,
          state: getStatusFromNumber(count),
          message: getStatusFromNumber(count),
          id: verifyRequestInstance.idRequest,
          dateTimeRequest: new Date().toISOString()
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

  //Response_Status_List_Digital_Address
  public async verify(
    idRichiesta: string
  ): Promise<ResponseStatusListDigitalAddress> {
    try {

        const richiesta = await DigitalAddressVerificationService.simulateWorkByIdRequest(idRichiesta);
        if(richiesta) {
          const result: ResponseStatusListDigitalAddress = {
          // idOperazione: request.idOperazioneClient,
          state: getStatusFromNumber(richiesta.count),
          message: getStatusFromNumber(richiesta.count),
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

    //ResponseListDigitalAddress //lista Response_Request_Digital_Address
  public async getByIdRequest(
      idRichiesta: string
    ): Promise<ResponseListDigitalAddress> {
      const responseListDigitalAddress: ResponseListDigitalAddress = {
          list: []
        };
      try {
        
          const richiesta = await DigitalAddressVerificationService.getByIdRequest(idRichiesta);
          if(richiesta && richiesta.count == 1) {
            const requestListDigitalAddress  = parseJsonToRequestListDigitalAddress(richiesta.jsonRequest);
            if (requestListDigitalAddress) {
              // Ciclare per tutti i codici fiscali
              for (const codiceFiscale of requestListDigitalAddress.codiciFiscali) {
                console.log(codiceFiscale); //ResponseRequestDigitalAddressModel
                const addressModel = await dataPreparationService.findByFiscalCode(codiceFiscale);
                if (addressModel) {
                  const address = responseRequestDigitalAddressModelToResponseRequestDigitalAddress(addressModel);
                  responseListDigitalAddress.list.push(address);
                }
              }
            }
          };
          return responseListDigitalAddress;
      } catch (error) {
        logger.error(`Error during in method controller 'findFiscalcode': `, error);
        throw error;
      }
  }
  
}
export default new DigitalAddressVerificationSingleController();

