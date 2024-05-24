import { logger } from "pdnd-common";
import { FiscalcodeModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  appendUniqueFiscalcodeModelsToArray,
  deleteFiscalcodeModelByFiscaldode,
} from "../utilities/fiscalcodeUtilities.js";

class DataPreparationService {
  public appContext = getContext();
  public eService: string = "fiscalcode-verification";
  public async saveList(
    fiscalCodeModel: FiscalcodeModel
  ): Promise<FiscalcodeModel[] | null> {
    try {
      logger.info(`[START] datapreparation-saveList`);
      const fiscalCodeData: FiscalcodeModel[] = [fiscalCodeModel];

      // recupera tutte le chiavi di data preparation
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const persistedFiscalcodeData =
        await dataPreparationRepository.findAllByKey(hash);

      // se è vuota, la salvo senza ulteriori controlli
      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
        await dataPreparationRepository.saveList(fiscalCodeData, hash);
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allHandshake = appendUniqueFiscalcodeModelsToArray(
          persistedFiscalcodeData,
          fiscalCodeData
        );
        await dataPreparationRepository.saveList(allHandshake, hash);
      }
      const response = await dataPreparationRepository.findAllByKey(hash);
      logger.info(`[END] datapreparation-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [DATA-PREPARATION]- Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<FiscalcodeModel[] | null> {
    try {
      logger.info(`[START] datapreparation-getAll`);
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const response = await dataPreparationRepository.findAllByKey(hash);
      logger.info(`[END] datapreparation-getAll`);
      return response;
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
      logger.info(`[START] datapreparation-deleteAllByKey`);
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const response = await dataPreparationRepository.deleteAllByKey(hash);
      logger.info(`[END] datapreparation-deleteAllByKey`);
      return response;
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
  ): Promise<FiscalcodeModel[] | null> {
    try {
      logger.info(`[START] deleteByFiscalcode`);
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const allSaved = await dataPreparationRepository.findAllByKey(hash);
      const fiscaldode = deleteFiscalcodeModelByFiscaldode(allSaved, uuid);
      await this.deleteAllByKey();
      if (fiscaldode) {
        await dataPreparationRepository.saveList(fiscaldode, hash);
      }
      logger.info(`[END] deleteByFiscalcode`);
      return fiscaldode;
    } catch (error) {
      logger.error(
        `deleteByFiscalcode - Errore durante l'aggiornamento della lista.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
