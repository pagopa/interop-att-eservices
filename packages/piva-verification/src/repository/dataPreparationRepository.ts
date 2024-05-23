import { logger } from "pdnd-common";
import { PartitaIvaModel } from "pdnd-models";
import { cacheManager } from "pdnd-common";
import { parseJsonToPivaArray } from "../utilities/jsonPivaUtilities.js";
import { findPivaModelByPiva } from "../utilities/pivaUtilities.js";

class dataPreparationRepository {
  public async saveList(
    genericRequest: PartitaIvaModel[],
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

  public async findAllByKey(key: string): Promise<PartitaIvaModel[] | null> {
    // pourposeId
    try {
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayUser = parseJsonToPivaArray(dataSaved);
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
    partitaIva: string
  ): Promise<PartitaIvaModel | null> {
    try {
      logger.info(partitaIva);
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const datas = parseJsonToPivaArray(dataSaved);
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return findPivaModelByPiva(datas, partitaIva);
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
      const arrayUser = parseJsonToPivaArray(dataSaved);
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
