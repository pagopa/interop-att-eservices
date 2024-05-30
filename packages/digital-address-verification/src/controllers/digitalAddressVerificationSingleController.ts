import { logger, getContext } from "pdnd-common";
import { requestParamNotValid } from "../exceptions/errors.js";
import {  ResponseRequestDigitalAddress, ResponseVerifyDigitalAddress } from "../model/domain/models.js";
import DataPreparationService from "../services/dataPreparationService.js"
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../model/domain/apiConverter.js";


class DigitalAddressVerificationSingleController {
  public appContext = getContext();

    //Response_Status_List_Digital_Address
    public async verify( 
      codiceFiscale: string,  
      digitalAddress: string,  
      since: string 

    ): Promise<ResponseVerifyDigitalAddress> {
      try {
  
          const richiesta = await DataPreparationService.findByFiscalCode(codiceFiscale);
          if (richiesta) {
            let foundItem =  richiesta.digitalAddress.find(richiesta => richiesta.digitalAddress === digitalAddress);
            if(foundItem) {
              if (richiesta.since <= since) {
                const result : ResponseVerifyDigitalAddress = {
                outcome: true,
                dateTimeCheck: new Date().toISOString()
              } 
              return result;
            }
          }
        }
          const result : ResponseVerifyDigitalAddress = {
          outcome: false,
          dateTimeCheck: new Date().toISOString()
          
        }
          return result;
          
      } catch (error) {
        logger.error(`Error during in method controller 'findFiscalcode': `, error);
        throw error;
      }
    }

  //Response_Status_List_Digital_Address
  public async extract(
    codiceFiscale: string  //Response_Request_Digital_Address
  ): Promise<ResponseRequestDigitalAddress> {
    try {

        const richiesta = await DataPreparationService.findByFiscalCode(codiceFiscale)
        if(richiesta) {
        return responseRequestDigitalAddressModelToResponseRequestDigitalAddress(richiesta);
      }
         else {
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
export default new DigitalAddressVerificationSingleController();

