import { logger } from "pdnd-common";
import { ErrorHandling, PartitaIvaModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  appendUniquePivaModelsToArray,
  arePartitaIvasValid,
  deletePivaModelByPiva,
} from "../utilities/pivaUtilities.js";
import { pivaNotValid } from "../exceptions/errors.js";

class DataPreparationService {
  public appContext = getContext();
  public eService: string = "piva-verification";
  public async saveList(
    pivaModel: PartitaIvaModel
  ): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] datapreparation-saveList`);
      if (
        pivaModel.organizationId == null ||
        pivaModel.organizationId.length <= 5
      ) {
        throw pivaNotValid();
      }

      const pivaData: PartitaIvaModel[] = [pivaModel];

      // recupera tutte le chiavi di data preparation
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const persistedPivaData = await dataPreparationRepository.findAllByKey(
        hash
      );

      // se è vuota, la salvo senza ulteriori controlli
      if (persistedPivaData == null || persistedPivaData.length === 0) {
        await dataPreparationRepository.saveList(pivaData, hash);
        logger.info(`[END] datapreparation-saveList`);
        return null;
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allPiva = appendUniquePivaModelsToArray(
          persistedPivaData,
          pivaData
        );
        if (arePartitaIvasValid(allPiva)) {
          await dataPreparationRepository.saveList(allPiva, hash);
        } else {
          throw ErrorHandling.invalidApiRequest();
        }
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

  public async getAll(): Promise<PartitaIvaModel[] | null> {
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
  public async deleteByPiva(uuid: string): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] deleteByPiva`);
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const allSaved = await dataPreparationRepository.findAllByKey(hash);
      if (allSaved == null) {
        return null;
      }
      const datapreparation = deletePivaModelByPiva(allSaved, uuid);
      await this.deleteAllByKey();
      if (datapreparation) {
        await dataPreparationRepository.saveList(datapreparation, hash);
      }
      logger.info(`[END] deleteByPiva`);
      return datapreparation;
    } catch (error) {
      logger.error(
        `deleteByPiva - Errore durante l'aggiornamento della lista.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
