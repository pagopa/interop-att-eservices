import { logger } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { cacheManager } from "pdnd-common";
import { parseJsonToResponseRequestDigitalAddressArray } from "../utilities/jsonFiscalcodeUtilities.js";
import { findFiscalcodeModelByFiscalcode } from "../utilities/fiscalcodeUtilities.js";

class dataPreparationRepository {
  public async saveList(
    genericRequest: ResponseRequestDigitalAddressModel[],
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

  public async findAllByKey(key: string): Promise<ResponseRequestDigitalAddressModel[] | null> {
    // pourposeId
    try {
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return parseJsonToResponseRequestDigitalAddressArray(dataSaved);
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async findByPurposeId(
    key: string,
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      logger.info(fiscalCode);
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const datas = parseJsonToResponseRequestDigitalAddressArray(dataSaved);
      logger.info(
        `dataPreparationRepository: Elemento recuperato con successo.`
      );
      return findFiscalcodeModelByFiscalcode(datas, fiscalCode);
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await cacheManager.deleteAllObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato

      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayDataSaved = parseJsonToResponseRequestDigitalAddressArray(dataSaved);
      if (arrayDataSaved == null) {
        return 0;
      } else {
        return arrayDataSaved?.length;
      }
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }
}

export default new dataPreparationRepository();
