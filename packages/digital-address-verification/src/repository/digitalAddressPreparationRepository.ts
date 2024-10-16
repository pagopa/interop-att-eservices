import { logger } from "pdnd-common";
import { cacheManager } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { parseJsonToVerifyRequestArray } from "../utilities/jsonVerifyRequestUtilities.js";
import { findRequestlByIdRequest } from "../utilities/verifyRequestUtilities.js";

class digitalAddressRepository {
  public async saveRequest(
    genericRequest: VerifyRequest[],
    key: string
  ): Promise<string | null> {
    try {
      await cacheManager.setObject(key, JSON.stringify(genericRequest));
      const saved = await cacheManager.getObjectByKey(key);
      logger.info(`DigitalAddressRepository: Elemento salvato con successo.`);
      return saved;
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il salvataggio del' elemento: `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(key: string): Promise<VerifyRequest[] | null> {
    // pourposeId
    try {
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      logger.info(
        `DigitalAddressRepository: Elemento recuperato con successo.`
      );
      return parseJsonToVerifyRequestArray(dataSaved);
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async findByIdRequest(
    key: string,
    fiscalCode: string
  ): Promise<VerifyRequest | null> {
    try {
      logger.info(fiscalCode);
      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const datas = parseJsonToVerifyRequestArray(dataSaved);
      logger.info(
        `DigitalAddressRepository: Elemento recuperato con successo.`
      );
      return findRequestlByIdRequest(datas, fiscalCode);
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await cacheManager.deleteAllObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato

      const dataSaved = await cacheManager.getObjectByKey(key); // Esegui un'operazione di recupero subito dopo aver salvato
      const arrayDataSaved = parseJsonToVerifyRequestArray(dataSaved);
      if (arrayDataSaved == null) {
        return 0;
      } else {
        return arrayDataSaved?.length;
      }
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error; // Rilancia l'errore per gestione superiore
    }
  }
}

export default new digitalAddressRepository();
