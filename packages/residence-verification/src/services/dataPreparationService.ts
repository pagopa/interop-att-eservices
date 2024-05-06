import { logger } from "pdnd-common";
import { UserModel } from "pdnd-models";
import { v4 as uuidv4 } from "uuid";
import { getContext } from "pdnd-common";
import { DataPreparationTemplate } from "../model/domain/models.js";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import { apiDataPreparationTemplateToUserModel } from "../model/domain/apiConverter.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  appendUniqueUserModelsToArray,
  findUserModelByUUID,
  deleteUserModelByUUID,
} from "../utilities/userUtilities.js";

class DataPreparationService {
  public appContext = getContext();

  public async saveList(
    genericRequest: DataPreparationTemplate
  ): Promise<UserModel[] | null> {
    try {
      logger.info(`[START] saveList`);
      const userData: UserModel[] = [
        apiDataPreparationTemplateToUserModel(genericRequest, uuidv4()),
      ];
      const hash = generateHash([this.appContext.authData.purposeId]);
      const persistedUserData = await dataPreparationRepository.findAllByKey(
        hash
      );
      if (persistedUserData == null || persistedUserData.length === 0) {
        await dataPreparationRepository.saveList(userData, hash);
      } else {
        const allUser = appendUniqueUserModelsToArray(
          persistedUserData,
          userData
        );
        await dataPreparationRepository.saveList(allUser, hash);
      }
      const response = await dataPreparationRepository.findAllByKey(hash);
      logger.info(`[END] saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList - Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<UserModel[] | null> {
    try {
      logger.info(`[START] getAll`);
      const hash = generateHash([this.appContext.authData.purposeId]);
      const response = await dataPreparationRepository.findAllByKey(hash);
      logger.info(`[END] getAll`);
      return response;
    } catch (error) {
      logger.error(`getAll: Errore durante il recupero della lista.`, error);
      throw error;
    }
  }

  public async getByUUID(uuid: string): Promise<UserModel | null> {
    try {
      logger.info(`[START] getByUUID`);
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByUuid(hash, uuid);
      const response = findUserModelByUUID(result, uuid);
      logger.info(`[START] getByUUID`);
      return response;
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      logger.info(`[START] deleteAllByKey`);
      const hash = generateHash([this.appContext.authData.purposeId]);
      const response = await dataPreparationRepository.deleteAllByKey(hash);
      logger.info(`[END] deleteAllByKey`);
      return response;
    } catch (error) {
      logger.error(
        `UserService: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  }

  public async deleteByUUID(uuid: string): Promise<UserModel[] | null> {
    try {
      logger.info(`[START] deleteByUUID`);
      const hash = generateHash([this.appContext.authData.purposeId]);
      const allSaved = await dataPreparationRepository.findAllByKey(hash);
      const user = deleteUserModelByUUID(allSaved, uuid);
      await this.deleteAllByKey();
      if (user) {
        await dataPreparationRepository.saveList(user, hash);
      }
      logger.info(`[END] deleteByUUID`);
      return user;
    } catch (error) {
      logger.error(
        `deleteByUUID - Errore durante l'aggiornamento della lista.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
