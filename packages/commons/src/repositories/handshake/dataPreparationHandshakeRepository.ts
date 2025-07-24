import { logger } from "pdnd-common";
import { HandshakeModel } from "pdnd-models";
import { cacheManager } from "pdnd-common";
import { parseJsonToHandshakeArray } from "../../utility/jsonHandshakeUtilities.js";
import { findHandshakeModelByApikey } from "../../utility/handshakeUtilities.js";

export class dataPreparationHandshakeRepository {
  public async saveList(
    genericRequest: HandshakeModel[],
    key: string
  ): Promise<string | null> {
    try {
      await cacheManager.setObject(key, JSON.stringify(genericRequest));
      const saved = await cacheManager.getObjectByKey(key);
      logger.info(`dataPreparationRepository: Item successfully saved.`);
      return saved;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Error during item saving: `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(key: string): Promise<HandshakeModel[] | null> {
    try {
      const dataSaved = await cacheManager.getObjectByKey(key);
      logger.info(`dataPreparationRepository: Item successfully retrieved.`);
      return parseJsonToHandshakeArray(dataSaved);
    } catch (error) {
      logger.error(`HandshakeRepository: Error during item retrieval: `, error);
      throw error;
    }
  }

  public async findByApikey(
    key: string,
    apikey: string
  ): Promise<HandshakeModel | null> {
    try {
      logger.info(apikey);
      const dataSaved = await cacheManager.getObjectByKey(key);
      const datas = parseJsonToHandshakeArray(dataSaved);
      logger.info(`dataPreparationRepository: Item successfully retrieved.`);
      return findHandshakeModelByApikey(datas, apikey);
    } catch (error) {
      logger.error(`HandshakeRepository: Error during item retrieval: `, error);
      throw error; // Re-throw the error for higher-level handling
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await cacheManager.deleteAllObjectByKey(key);

      const dataSaved = await cacheManager.getObjectByKey(key);
      const arrayHandshake = parseJsonToHandshakeArray(dataSaved);
      if (arrayHandshake == null) {
        return 0;
      } else {
        return arrayHandshake?.length;
      }
    } catch (error) {
      logger.error(`HandshakeRepository: Error during item retrieval: `, error);
      throw error;
    }
  }
}

export default new dataPreparationHandshakeRepository();
