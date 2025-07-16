import { logger } from "pdnd-common";
import { PartitaIvaModel } from "pdnd-models";
import { PivaRepository } from "../../repositories/piva-verification/piva.js";

class DataPreparationService {
  public eService: string = "piva-verification";
  private pivaRepository: PivaRepository;

  constructor() {
    this.pivaRepository = new PivaRepository();
  }
  
  public async saveIfNotExists(
    pivaModel: PartitaIvaModel,
  ): Promise<PartitaIvaModel | null> {
    try {
      logger.info(`[PivaService][START] saveIfNotExists`);

      const exists = await this.pivaRepository.getPivaObjectByKey(
        pivaModel.organizationId,
      );

      if (!exists) {
        await this.pivaRepository.setPivaObject(pivaModel.organizationId);
        logger.info(
          `[PivaService] organizationId salvato: ${pivaModel.organizationId}`,
        );
        return pivaModel;
      } else {
        logger.info(
          `[PivaService] organizationId già esistente: ${pivaModel.organizationId}`,
        );
        return null;
      }
    } catch (error) {
      logger.error(
        `[PivaService] Errore durante il salvataggio dell'organizationId.`,
        error,
      );
      throw error;
    }
  }

  public async getAll(): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] datapreparation-getAll`);

      const response = await this.pivaRepository.getAllPivaObject();
      logger.info(`[END] datapreparation-getAll`);
      return response;
    } catch (error) {
      logger.error(
        `getAll [DATA-PREPARATION]: Errore durante il recupero della lista.`,
        error,
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<void> {
    try {
      logger.info(`[START] datapreparation-deleteAllByKey`);
      const response = await this.pivaRepository.deleteAllPivaObject();
      logger.info(`[END] datapreparation-deleteAllByKey`);
      return response;
    } catch (error) {
      logger.error(
        `datapreparationService [DATA-PREPARATION]: Errore durante la cancellazione della lista. `,
        error,
      );
      throw error;
    }
  }

  public async deleteByPiva(
    pivaModel: PartitaIvaModel,
  ): Promise<PartitaIvaModel | null> {
    try {
      logger.info(`[START] deleteByPiva`);
      await this.pivaRepository.deletePivaObjectByKey(
        pivaModel.organizationId,
      );
      logger.info(`[END] deleteByPiva`);
      return pivaModel;
    } catch (error) {
      logger.error(
        `deleteByPiva - Errore durante l'aggiornamento della lista.`,
        error,
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
