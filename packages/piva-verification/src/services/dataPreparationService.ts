import { logger } from "pdnd-common";
import { PartitaIvaModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  appendUniquePivaModelsToArray,
  deletePivaModelByPiva,
} from "../utilities/pivaUtilities.js";

class DataPreparationService {
  public appContext = getContext();
  public eService: string = "piva-verification";
  public async saveList(
    pivaModel: PartitaIvaModel
  ): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] datapreparation-saveList`);
      const pivaData: PartitaIvaModel[] = [pivaModel];

      // recupera tutte le chiavi di data preparation
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const persistedPivaData =
        await dataPreparationRepository.findAllByKey(hash);

      // se è vuota, la salvo senza ulteriori controlli
      if (
        persistedPivaData == null ||
        persistedPivaData.length === 0
      ) {
        await dataPreparationRepository.saveList(pivaData, hash);
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allHandshake = appendUniquePivaModelsToArray(
          persistedPivaData,
          pivaData
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
        `UserService [DATA-PREPARATION]: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  }
  public async deleteByPiva(
    uuid: string
  ): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] deleteByPiva`);
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const allSaved = await dataPreparationRepository.findAllByKey(hash);
      const user = deletePivaModelByPiva(allSaved, uuid);
      await this.deleteAllByKey();
      if (user) {
        await dataPreparationRepository.saveList(user, hash);
      }
      logger.info(`[END] deleteByPiva`);
      return user;
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
