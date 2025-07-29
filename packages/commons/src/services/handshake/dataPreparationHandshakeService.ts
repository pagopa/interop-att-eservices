/* eslint-disable @typescript-eslint/no-empty-function */
import { logger, certNotValidError } from "../../logging/index.js";
import { HandshakeModel } from "../../db/model/handshake.js";
import {
  appendUniqueHandshakeModelsToArray,
  isCertUnique,
} from "../../utility/handshakeUtilities.js";
import { dataPreparationHandshakeRepository } from "../../repositories/handshake/dataPreparationHandshakeRepository.js";

// const key = "piva-verification-handshake";
export const DataPreparationHandshakeService = {
  async saveList(
    handshakeModel: HandshakeModel
  ): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-saveList`);
      const handshakeData: HandshakeModel[] = [handshakeModel];

      const persistedHandshakeData =
        await dataPreparationHandshakeRepository.findAllByKey();
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
        await dataPreparationHandshakeRepository.saveList(handshakeData);
      } else {
        const allHandshake = appendUniqueHandshakeModelsToArray(
          persistedHandshakeData,
          handshakeData
        );
        await dataPreparationHandshakeRepository.saveList(allHandshake);
      }
      const response = await dataPreparationHandshakeRepository.findAllByKey();
      logger.info(`[END] handshake-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [HANDSHAKE] - Error while saving the list.`,
        error
      );
      throw error;
    }
  },

  async getAll(): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-getAll`);
      const response = await dataPreparationHandshakeRepository.findAllByKey();
      logger.info(`[END] handshake-getAll`);
      return response;
    } catch (error) {
      logger.error(
        `getAll [HANDSHAKE]: Error while retrieving the list.`,
        error
      );
      throw error;
    }
  },

  async deleteAllByKey(): Promise<number | null> {
    try {
      logger.info(`[START] handshake-deleteAllByKey`);
      const response =
        await dataPreparationHandshakeRepository.deleteAllByKey();
      logger.info(`[END] handshake-deleteAllByKey`);
      return response;
    } catch (error) {
      logger.error(
        `handshakeService [HANDSHAKE]: Error while deleting the list.`,
        error
      );
      throw error;
    }
  },

  async getByApikey(apikey: string): Promise<HandshakeModel | null> {
    try {
      logger.info(`[START] handshake-getByApikey`);
      const response = await dataPreparationHandshakeRepository.findByApikey(
        apikey
      );
      logger.info(`[END] handshake-getByApikey`);
      return response;
    } catch (error) {
      logger.error(
        `handshakeService [HANDSHAKE]: Error while deleting the list.`,
        error
      );
      throw error;
    }
  },
};
