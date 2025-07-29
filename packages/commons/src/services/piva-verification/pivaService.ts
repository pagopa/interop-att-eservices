import { PartitaIvaModel } from "pdnd-models";
import { logger } from "../../index.js";
import { PivaRepository } from "../../repositories/piva-verification/piva.js";

export const PivaVerificationService = {
  async saveList(pivaModel: PartitaIvaModel): Promise<PartitaIvaModel | null> {
    try {
      logger.info(`[PivaService][START] saveIfNotExists`);

      const exists = await PivaRepository.getPivaObjectByKey(
        pivaModel.organizationId
      );

      if (!exists) {
        await PivaRepository.setPivaObject(pivaModel.organizationId);
        logger.info(
          `[PivaService] organizationId salvato: ${pivaModel.organizationId}`
        );
        return pivaModel;
      } else {
        logger.info(
          `[PivaService] organizationId già esistente: ${pivaModel.organizationId}`
        );
        return null;
      }
    } catch (error) {
      logger.error(
        `[PivaService] Errore durante il salvataggio dell'organizationId.`,
        error
      );
      throw error;
    }
  },

  async getByPiva(organizationId: string): Promise<PartitaIvaModel | null> {
    try {
      logger.info(`[START] datapreparation-getByPiva`);

      const response = await PivaRepository.getPivaObjectByKey(organizationId);
      logger.info(`[END] datapreparation-getByPiva`);
      return response;
    } catch (error) {
      logger.error(
        `getByPiva [DATA-PREPARATION]: Errore durante il recupero della partita IVA.`,
        error
      );
      throw error;
    }
  },

  async getAll(): Promise<PartitaIvaModel[] | null> {
    try {
      logger.info(`[START] datapreparation-getAll`);

      const response = await PivaRepository.getAllPivaObject();
      logger.info(`[END] datapreparation-getAll`);
      return response;
    } catch (error) {
      logger.error(
        `getAll [DATA-PREPARATION]: Errore durante il recupero della lista.`,
        error
      );
      throw error;
    }
  },

  async deleteAllByKey(): Promise<string | null> {
    try {
      logger.info(`[START] datapreparation-deleteAllByKey`);
      await PivaRepository.deleteAllPivaObject();
      logger.info(`[END] datapreparation-deleteAllByKey`);
      return "Success";
    } catch (error) {
      logger.error(
        `datapreparationService [DATA-PREPARATION]: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  },

  async deleteByPiva(
    pivaModel: PartitaIvaModel
  ): Promise<PartitaIvaModel | null> {
    try {
      logger.info(`[START] deleteByPiva`);
      await PivaRepository.deletePivaObjectByKey(pivaModel.organizationId);
      logger.info(`[END] deleteByPiva`);
      return pivaModel;
    } catch (error) {
      logger.error(
        `deleteByPiva - Errore durante l'aggiornamento della lista.`,
        error
      );
      throw error;
    }
  },
};
