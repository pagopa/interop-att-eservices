import { logger, getContext, digitalAddress } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { appendUniqueFiscalcodeModelsToArray } from "../utilities/fiscalcodeUtilities.js";

class DataPreparationController {
  public appContext = getContext();
  public eService: string = "digital-address-verification";

  public async saveList(
    fiscalCodeModel: ResponseRequestDigitalAddressModel
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      const fiscalCodeData: ResponseRequestDigitalAddressModel[] = [
        fiscalCodeModel,
      ];

      const persistedFiscalcodeData =
        await digitalAddress.findAllDataPreparation();

      // eslint-disable-next-line functional/no-let
      let allFiscalcode: ResponseRequestDigitalAddressModel[];

      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
        logger.info(`[CONTROLLER] Creazione nuova lista dati.`);
        await digitalAddress.saveDataPreparationList(fiscalCodeData);
        return null;
      } else {
        logger.info(`[CONTROLLER] Aggiornamento lista dati esistente.`);
        allFiscalcode = appendUniqueFiscalcodeModelsToArray(
          persistedFiscalcodeData,
          fiscalCodeData
        );
        await digitalAddress.saveDataPreparationList(allFiscalcode);
        return await digitalAddress.findAllDataPreparation();
      }
    } catch (error) {
      logger.error(
        `saveList [DATA-PREPARATION-CONTROLLER] - Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      return await digitalAddress.findAllDataPreparation();
    } catch (error) {
      logger.error(
        `getAll [DATA-PREPARATION-CONTROLLER]: Errore durante il recupero della lista.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      return await digitalAddress.deleteAllDataPreparation();
    } catch (error) {
      logger.error(
        `deleteAllByKey [DATA-PREPARATION-CONTROLLER]: Errore durante la cancellazione della lista.`,
        error
      );
      throw error;
    }
  }

  public async deleteByFiscalCode(
    uuid: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      await digitalAddress.deleteSingleDataPreparationByFiscalCode(uuid);
      return await digitalAddress.findAllDataPreparation();
    } catch (error) {
      logger.error(
        `deleteByFiscalCode [DATA-PREPARATION-CONTROLLER] - Errore durante l'eliminazione.`,
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
        `findByFiscalCode [DATA-PREPARATION-CONTROLLER] - Errore durante il recupero.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationController();
