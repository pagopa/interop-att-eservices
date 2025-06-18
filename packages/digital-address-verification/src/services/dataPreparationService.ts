import { logger, getContext } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";

import { appendUniqueFiscalcodeModelsToArray } from "../utilities/fiscalcodeUtilities.js";

class DataPreparationService {
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
        await dataPreparationRepository.findAllByKey();

      // eslint-disable-next-line functional/no-let
      let allFiscalcode: ResponseRequestDigitalAddressModel[];

      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
        await dataPreparationRepository.saveList(fiscalCodeData);
        return null;
      } else {
        allFiscalcode = appendUniqueFiscalcodeModelsToArray(
          persistedFiscalcodeData,
          fiscalCodeData
        );
        await dataPreparationRepository.saveList(allFiscalcode);
        return await dataPreparationRepository.findAllByKey();
      }
    } catch (error) {
      logger.error(
        `saveList [DATA-PREPARATION]- Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      return await dataPreparationRepository.findAllByKey();
    } catch (error) {
      logger.error(
        `getAll [DATA-PREPARATION]: Errore durante il recupero della lista.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      return await dataPreparationRepository.deleteAllByKey();
    } catch (error) {
      logger.error(
        `datapreparationService [DATA-PREPARATION]: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  }

  public async deleteByFiscalCode(
    uuid: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      await dataPreparationRepository.deleteSingleByFiscalCode(uuid);

      return await dataPreparationRepository.findAllByKey();
    } catch (error) {
      logger.error(
        `deleteByFiscalcode - Errore durante l'eliminazione.`,
        error
      );
      throw error;
    }
  }

  public async findByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      return await dataPreparationRepository.findByFiscalCode(fiscalCode);
    } catch (error) {
      logger.error(`findByFiscalCode - Errore durante il recupero.`, error);
      throw error;
    }
  }
}

export default new DataPreparationService();
