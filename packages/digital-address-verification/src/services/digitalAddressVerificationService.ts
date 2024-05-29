import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import digitalAddressRepository from "../repository/digitalAddressPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { appendUniqueVerifyRequestToArray, findRequestlByIdRequest } from "../utilities/verifyRequestUtilities.js";

class FiscalcodeVerificationService {
  public appContext = getContext();
  public eService: string = "digital-address-verification";

  public async saveAll(
    fiscalCodeModel: VerifyRequest
  ): Promise<VerifyRequest[] | null> {
    try {
      logger.info(`[START] datapreparation-saveList`);
      const fiscalCodeData: VerifyRequest[] = [fiscalCodeModel];

      // recupera tutte le chiavi di data preparation
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const persistedFiscalcodeData =
        await digitalAddressRepository.findAllByKey(hash);

      // se è vuota, la salvo senza ulteriori controlli
      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
        await digitalAddressRepository.saveRequest(fiscalCodeData, hash);
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allFiscalcode = appendUniqueVerifyRequestToArray(
          persistedFiscalcodeData,
          fiscalCodeData
        );
        //if (areFiscalCodesValid(allFiscalcode)) {
        await digitalAddressRepository.saveRequest(allFiscalcode, hash);
       //} else {
       // throw ErrorHandling.invalidApiRequest();
       //}
      }
      const response = await digitalAddressRepository.findAllByKey(hash);
      logger.info(`[END] datapreparation-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [DATA-PREPARATION]- Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }
 

  public async getByIdRequest(
    idRequest: string
  ): Promise<VerifyRequest | null> {
    try {
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const result = await digitalAddressRepository.findAllByKey(hash);
      const requests = result;
      const found = findRequestlByIdRequest(requests, idRequest);
      return found;
    } catch (error) {
      logger.error(
        `DigitalAddressVerification: Errore durante il recupero dell'utente dal codice fiscale. `,
        error
      );
      throw error;
    }
  }

  public async updateStatusByIdRequest(
    verifyRequest: VerifyRequest
  ): Promise<VerifyRequest | null> {
    try {
      if (verifyRequest.count > 0) {
        verifyRequest.count -= 1;
        await this.saveAll(verifyRequest);
    }
    return verifyRequest;
    } catch (error) {
      logger.error(
        `DigitalAddressVerification: Errore durante il recupero dell'utente dal codice fiscale. `,
        error
      );
      throw error;
    }
  }
}

export default new FiscalcodeVerificationService();
