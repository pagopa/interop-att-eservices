import { logger } from "pdnd-common";
import { UserModel } from "pdnd-models";
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

  public async findAllByUuid(
    key: string,
    uuid: string
  ): Promise<UserModel[] | null> {
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

  public async save(key: string, user: UserModel): Promise<string | null> {
    try {
      const existingData = await this.findAllByKey(key);
      const updatedData = existingData ? [...existingData, user] : [user];
      await cacheManager.setObject(key, JSON.stringify(updatedData));
      logger.info(`dataPreparationRepository: Utente salvato con successo.`);
      return key;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il salvataggio dell'utente: `,
        error
      );
      throw error;
    }
  }

  public async update(
    key: string,
    uuid: string,
    updatedUser: UserModel
  ): Promise<UserModel[] | null> {
    try {
      const existingData = await this.findAllByKey(key);
      if (!existingData) {
        logger.warn(
          `dataPreparationRepository: Nessun dato trovato per la chiave fornita.`
        );
        return null;
      }

      const updatedData = existingData.map((user) =>
        user.uuid === uuid ? updatedUser : user
      );

      await cacheManager.setObject(key, JSON.stringify(updatedData));
      logger.info(`dataPreparationRepository: Utente aggiornato con successo.`);
      return updatedData;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante l'aggiornamento dell'utente: `,
        error
      );
      throw error;
    }
  }
}

export default new dataPreparationRepository();
