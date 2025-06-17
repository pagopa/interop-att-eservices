import { logger, persistenceService } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";

class DataPreparationRepository {
  public async saveList(
    genericRequest: ResponseRequestDigitalAddressModel[],
    key: string
  ): Promise<string | null> {
    try {
      await persistenceService.saveDataPreparationList(genericRequest, key);
      logger.info(
        `dataPreparationRepository: Chiamata a saveDataPreparationList per purposeId '${key}' completata.`
      );
      return key;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il salvataggio dell'elemento con chiave '${key}': `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(
    key: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      logger.info(
        `dataPreparationRepository: Ricerca di tutti gli elementi per chiave (purposeId) '${key}'.`
      );
      return await persistenceService.findAllDataPreparationByPurpose(key);
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero degli elementi per chiave '${key}': `,
        error
      );
      throw error;
    }
  }

  public async findByPurposeId(
    key: string,
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      logger.info(
        `dataPreparationRepository: Ricerca per purposeId '${key}' e fiscalCode '${fiscalCode}'.`
      );
      return await persistenceService.findSingleDataPreparationByFiscalCode(
        key,
        fiscalCode
      );
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero dell'elemento per chiave '${key}' e codice fiscale: `,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(key: string): Promise<number> {
    try {
      logger.info(
        `dataPreparationRepository: Cancellazione di tutti gli elementi per chiave (purposeId) '${key}'.`
      );
      const deletedCount =
        await persistenceService.deleteAllDataPreparationByPurpose(key);
      return deletedCount;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante la cancellazione degli elementi per chiave '${key}': `,
        error
      );
      throw error;
    }
  }

  public async deleteSingleByFiscalCode(
    key: string,
    fiscalCode: string
  ): Promise<number> {
    try {
      logger.info(
        `dataPreparationRepository: Cancellazione per chiave '${key}' e fiscalCode '${fiscalCode}'.`
      );
      return await persistenceService.deleteSingleSubjectByPurposeId(
        key,
        fiscalCode
      );
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante la cancellazione del singolo elemento: `,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationRepository();
