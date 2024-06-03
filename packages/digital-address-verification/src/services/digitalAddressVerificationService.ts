import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import digitalAddressRepository from "../repository/digitalAddressPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  appendUniqueVerifyRequestToArray,
  findRequestlByIdRequest,
} from "../utilities/verifyRequestUtilities.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { getMaxNumber } from "../utilities/statusRequestUtility.js";

class DigitalAddressVerificationService {
  public appContext = getContext();
  public eService: string = "digital-address-verification-request";

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
      /* eslint-disable */
      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
         /* eslint-enable */
        await digitalAddressRepository.saveRequest(fiscalCodeData, hash);
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allFiscalcode = appendUniqueVerifyRequestToArray(
          persistedFiscalcodeData,
          fiscalCodeData
        );
        // if (areFiscalCodesValid(allFiscalcode)) {
        await digitalAddressRepository.saveRequest(allFiscalcode, hash);
        // } else {
        // throw ErrorHandling.invalidApiRequest();
        // }
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
      return findRequestlByIdRequest(requests, idRequest);
    } catch (error) {
      logger.error(
        `DigitalAddressVerification: Errore durante il recupero dell'utente dal codice fiscale. `,
        error
      );
      throw error;
    }
  }
/* eslint-disable */
  public async simulateWorkByIdRequest(
    idRequest: string
  ): Promise<VerifyRequest | null> {
    try {
      const verifyRequest = await this.getByIdRequest(idRequest);
      if (verifyRequest && verifyRequest.count > 1) {
        const decrement = Math.floor(Math.random() * getMaxNumber()) + 1;
        verifyRequest.count = Math.max(1, verifyRequest.count - decrement);
        //verifyRequest.count -= 1;
        await this.saveAll(verifyRequest);
      }
      return verifyRequest;
    } catch (error) {
      logger.error(
        `DigitalAddressVerification: Errore durante la simulazione del lavoro. `,
        error
      );
      throw error;
    }
  }
} /* eslint-enable */

export default new DigitalAddressVerificationService();
