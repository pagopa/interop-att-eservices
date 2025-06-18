import { logger } from "pdnd-common";
import digitalAddressRepository from "../repository/digitalAddressPreparationRepository.js";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { getMaxNumber } from "../utilities/statusRequestUtility.js";

class DigitalAddressVerificationService {
  public eService: string = "digital-address-verification-request";

  public async createRequest(
    verifyRequestModel: VerifyRequest
  ): Promise<VerifyRequest> {
    try {
      logger.info(
        `[SERVICE] Creating new verification request with id: ${verifyRequestModel.idRequest}`
      );
      await digitalAddressRepository.save(verifyRequestModel);
      logger.info(`[SERVICE] Request saved successfully.`);
      return verifyRequestModel;
    } catch (error) {
      logger.error(
        `createRequest [SERVICE] - Error while saving the request: ${error}`
      );
      throw error;
    }
  }

  public async getByIdRequest(
    idRequest: string
  ): Promise<VerifyRequest | null> {
    try {
      logger.info(`[SERVICE] Fetching request with id: ${idRequest}`);
      const result = await digitalAddressRepository.findById(idRequest);
      logger.info(`[SERVICE] Request fetch completed.`);
      return result;
    } catch (error) {
      logger.error(
        `getByIdRequest [SERVICE] - Error while fetching request by id: ${idRequest}. Error: ${error}`
      );
      throw error;
    }
  }

  public async simulateWorkByIdRequest(
    idRequest: string
  ): Promise<VerifyRequest | null> {
    try {
      logger.info(`[SERVICE] Simulating work for request id: ${idRequest}`);

      // 1. Trova il singolo record in modo efficiente.
      const verifyRequest = await this.getByIdRequest(idRequest);

      if (verifyRequest && verifyRequest.count > 1) {
        // 2. Crea un nuovo oggetto con il campo aggiornato.
        const decrement = Math.floor(Math.random() * getMaxNumber()) + 1;
        const updatedVerifyRequest = {
          ...verifyRequest,
          count: Math.max(1, verifyRequest.count - decrement),
        };

        // 3. Aggiorna il singolo record nel database.
        await digitalAddressRepository.update(updatedVerifyRequest);
        logger.info(
          `[SERVICE] Updated request id ${idRequest} with new count ${updatedVerifyRequest.count}`
        );
        return updatedVerifyRequest;
      } else if (verifyRequest) {
        logger.info(
          `[SERVICE] Request id ${idRequest} is already completed (count: ${verifyRequest.count}).`
        );

        return verifyRequest;
      }

      return verifyRequest;
    } catch (error) {
      logger.error(
        `simulateWorkByIdRequest [SERVICE] - Error during work simulation for id ${idRequest}. Error: ${error}`
      );
      throw error;
    }
  }
}

export default new DigitalAddressVerificationService();
