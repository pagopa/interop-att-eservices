import { UserModel } from "pdnd-models";
import { cacheManager, logger } from "pdnd-common";
import { parseJsonToUserArray } from "../utilities/jsonUserUtilities.js";

class dataPreparationRepository {
  public async saveList(
    genericRequest: UserModel[],
    key: string
  ): Promise<string | null> {
    try {
      await cacheManager.setObject(key, JSON.stringify(genericRequest));
      const saved = await cacheManager.getObjectByKey(key);
      logger.info(`dataPreparationRepository: Item saved successfully.`);
      return saved;
    } catch (error) {
      logger.error(`dataPreparationRepository: Error saving item: `, error);
      throw error;
    }
  }

  public async findAllByKey(key: string): Promise<UserModel[] | null> {
    try {
      const dataSaved = await cacheManager.getObjectByKey(key);
      const arrayUser = parseJsonToUserArray(dataSaved);
      logger.info(`dataPreparationRepository: Item retrieved successfully.`);
      return arrayUser;
    } catch (error) {
      logger.error(`userRepository: Error retrieving item: `, error);
      throw error;
    }
  }

  public async findAllByUuid(
    key: string,
    uuid: string
  ): Promise<UserModel[] | null> {
    try {
      logger.info(uuid);
      const dataSaved = await cacheManager.getObjectByKey(key);
      const datas = parseJsonToUserArray(dataSaved);
      logger.info(`dataPreparationRepository: Item retrieved successfully.`);
      return datas;
    } catch (error) {
      logger.error(`userRepository: Error retrieving item: `, error);
      throw error;
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await cacheManager.deleteAllObjectByKey(key);

      const dataSaved = await cacheManager.getObjectByKey(key);
      const arrayUser = parseJsonToUserArray(dataSaved);
      if (arrayUser == null) {
        return 0;
      } else {
        return arrayUser?.length;
      }
    } catch (error) {
      logger.error(`userRepository: Error retrieving item: `, error);
      throw error;
    }
  }
}

export default new dataPreparationRepository();
