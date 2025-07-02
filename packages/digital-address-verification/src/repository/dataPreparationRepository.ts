import { logger, digitalAddress } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";

class DataPreparationRepository {
  public async saveList(
    genericRequest: ResponseRequestDigitalAddressModel[]
  ): Promise<void> {
    try {
      await digitalAddress.saveDataPreparationList(genericRequest);
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il salvataggio della lista: `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(): Promise<
    ResponseRequestDigitalAddressModel[] | null
  > {
    try {
      return await digitalAddress.findAllDataPreparation();
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero degli elementi: `,
        error
      );
      throw error;
    }
  }

  public async findByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      return await digitalAddress.findSingleDataPreparationByFiscalCode(
        fiscalCode
      );
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante il recupero dell'elemento per codice fiscale: `,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number> {
    try {
      return await digitalAddress.deleteAllDataPreparation();
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Errore durante la cancellazione degli elementi: `,
        error
      );
      throw error;
    }
  }

  public async deleteSingleByFiscalCode(fiscalCode: string): Promise<number> {
    try {
      return await digitalAddress.deleteSingleDataPreparationByFiscalCode(
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
