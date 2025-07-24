import { logger, certNotValidError } from "../../logging/index.js";
import { HandshakeModel } from "../../db/model/handshake.js";
import dataPreparationHandshakeRepository from "../../repositories/handshake/dataPreparationHandshakeRepository.js";
import {
  appendUniqueHandshakeModelsToArray,
  isCertUnique,
} from "../../utility/handshakeUtilities.js";

class DataPreparationHandshakeService {
  private key: string = "piva-verification-handshake";

  public async saveList(
    handshakeModel: HandshakeModel
  ): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-saveList`);
      const handshakeData: HandshakeModel[] = [handshakeModel];

      const persistedHandshakeData =
        await dataPreparationHandshakeRepository.findAllByKey(this.key);
      if (!isCertUnique(persistedHandshakeData, handshakeData)) {
        logger.info(
          "The provided certificate is associated with another api key."
        );
        throw certNotValidError(`The certificate is not valid`);
      }
      if (
        persistedHandshakeData == null ||
        persistedHandshakeData.length === 0
      ) {
        await dataPreparationHandshakeRepository.saveList(
          handshakeData,
          this.key
        );
      } else {
        const allHandshake = appendUniqueHandshakeModelsToArray(
          persistedHandshakeData,
          handshakeData
        );
        await dataPreparationHandshakeRepository.saveList(
          allHandshake,
          this.key
        );
      }
      const response = await dataPreparationHandshakeRepository.findAllByKey(
        this.key
      );
      logger.info(`[END] handshake-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [HANDSHAKE] - Error while saving the list.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-getAll`);
      const response = await dataPreparationHandshakeRepository.findAllByKey(
        this.key
      );
      logger.info(`[END] handshake-getAll`);
      return response;
    } catch (error) {
      logger.error(
        `getAll [HANDSHAKE]: Error while retrieving the list.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      logger.info(`[START] handshake-deleteAllByKey`);
      const response = await dataPreparationHandshakeRepository.deleteAllByKey(
        this.key
      );
      logger.info(`[END] handshake-deleteAllByKey`);
      return response;
    } catch (error) {
      logger.error(
        `handshakeService [HANDSHAKE]: Error while deleting the list.`,
        error
      );
      throw error;
    }
  }

  public async getByPurposeId(
    purposeId: string
  ): Promise<HandshakeModel | null> {
    try {
      logger.info(`[START] handshake-getByPurposeId`);
      const response = await dataPreparationHandshakeRepository.findByPurposeId(
        this.key,
        purposeId
      );
      logger.info(`[END] handshake-getByPurposeId`);
      return response;
    } catch (error) {
      logger.error(
        `handshakeService [HANDSHAKE]: Error while deleting the list.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationHandshakeService();
