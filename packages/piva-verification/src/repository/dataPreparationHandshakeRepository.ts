import { logger } from "pdnd-common";
import { HandshakeModel } from "pdnd-models";
import { cacheManager } from "pdnd-common";
import { parseJsonToHandshakeArray } from "../utilities/jsonHandshakeUtilities.js";
import { findHandshakeModelByPourposeId } from "../utilities/handshakeUtilities.js";

class dataPreparationHandshakeRepository {
  public async saveList(
    genericRequest: HandshakeModel[],
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

  public async findAllByKey(key: string): Promise<HandshakeModel[] | null> {
    // pourposeId
    try {
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayUser = parseJsonToHandshakeArray(dataSaved);
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

  public async findByPurposeId(
    key: string,
    pourposeId: string
  ): Promise<HandshakeModel | null> {
    try {
      logger.info(pourposeId);
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const datas = parseJsonToHandshakeArray(dataSaved);
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return findHandshakeModelByPourposeId(datas, pourposeId);
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
      const arrayUser = parseJsonToHandshakeArray(dataSaved);
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

export default new dataPreparationHandshakeRepository();
