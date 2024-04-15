import { logger } from "pdnd-common";
import { UserModel } from "pdnd-model";
import { cacheManager } from "pdnd-common";
import { parseJsonToUserArray } from "../utilities/jsonUserUtilities.js";

class dataPreparationRepository {
  public async saveList(
    genericRequest: UserModel[],
    key: string
  ): Promise<string | null> {
    try {
      await cacheManager.setObject(key, JSON.stringify(genericRequest));
      const saved = await cacheManager.getObjectByKey(key);
      logger.info(`dataPreparationRepository: Elemento salvato con successo.`);
      return saved;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il salvataggio del' elemento: `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(key: string): Promise<UserModel[] | null> {
    try {
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayUser = parseJsonToUserArray(dataSaved);
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return arrayUser;
    } catch (error) {
      logger.error(
        `userRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async findAllByUuid(key: string, uuid: string): Promise<UserModel[] | null> {
    try {
      logger.info(uuid);
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const datas = parseJsonToUserArray(dataSaved);
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return datas;
    } catch (error) {
      logger.error(
        `userRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await cacheManager.deleteAllObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato

      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayUser = parseJsonToUserArray(dataSaved);
      if (arrayUser == null) {
        return 0;
      } else {
        return arrayUser?.length;
      }
    } catch (error) {
      logger.error(
        `userRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }
}

export default new dataPreparationRepository();
