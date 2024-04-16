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
  appContext = getContext();

  public async saveList(
    genericRequest: DataPreparationTemplate
  ): Promise<UserModel[] | null> {
    try {
      const userData: UserModel[] = [];
      userData.push(
        apiDataPreparationTemplateToUserModel(genericRequest, uuidv4())
      );
      const hash = generateHash([this.appContext.authData.purposeId]);
      const persistedUserData = await dataPreparationRepository.findAllByKey(
        hash
      );
      if (persistedUserData == null || persistedUserData.length == 0) {
        await dataPreparationRepository.saveList(userData, hash);
      } else {
        const allUser = appendUniqueUserModelsToArray(
          persistedUserData,
          userData
        );
        await dataPreparationRepository.saveList(allUser, hash);
      }
      return await dataPreparationRepository.findAllByKey(hash);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<UserModel[] | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      return await dataPreparationRepository.findAllByKey(hash);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il recupero della lista. `,
        error
      );
      throw error;
    }
  }

  public async getByUUID(uuid: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByUuid(hash, uuid);
      return findUserModelByUUID(result, uuid);
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
      const hash = generateHash([this.appContext.authData.purposeId]);
      return await dataPreparationRepository.deleteAllByKey(hash);
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
      const hash = generateHash([this.appContext.authData.purposeId]);
      const allSaved = await dataPreparationRepository.findAllByKey(hash);
      const user = deleteUserModelByUUID(allSaved, uuid);
      this.deleteAllByKey();
      if(user) {
        dataPreparationRepository.saveList(user, hash);
      }
      return user;
    } catch (error) {
      logger.error(
        `UserService: Errore durante l'aggiornamento della lista. `,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
