import { FiscalcodeModel, ErrorHandling } from "pdnd-models";
import { FiscalCodeRepository } from "../../repositories/fiscal-code-verification/fiscalCodeRepository.js";
import { logger } from "../../index.js";

export const FiscalCodeService = {
  async getByFiscalCode(fiscalCode: string): Promise<FiscalcodeModel | null> {
    logger.info(`Searching for fiscal code model: ${fiscalCode}`);
    try {
      return await FiscalCodeRepository.findByFiscalCode(fiscalCode);
    } catch (error) {
      logger.error(
        `GenericFiscalCodeVerificationService: Errore durante la ricerca del codice fiscale.`,
        error
      );
      throw error;
    }
  },
  async saveList(
    fiscalCodeModel: FiscalcodeModel
  ): Promise<FiscalcodeModel[] | null> {
    logger.info(
      `[START] datapreparation-saveList for: ${fiscalCodeModel.fiscalCode}`
    );
    try {
      await FiscalCodeRepository.save(fiscalCodeModel);
      const response = await FiscalCodeRepository.findAll();
      logger.info(`[END] datapreparation-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [DATA-PREPARATION] - Errore durante il salvataggio.`,
        error
      );
      if (error === "23505") {
        throw ErrorHandling.invalidApiRequest("Fiscal code already exists.");
      }
      throw error;
    }
  },

  async getAll(): Promise<FiscalcodeModel[] | null> {
    logger.info(`[START] datapreparation-getAll`);
    const response = await FiscalCodeRepository.findAll();
    logger.info(`[END] datapreparation-getAll`);
    return response;
  },

  async deleteAllByKey(): Promise<number | null> {
    logger.info(`[START] datapreparation-deleteAllByKey`);
    const response = await FiscalCodeRepository.deleteAll();
    logger.info(`[END] datapreparation-deleteAllByKey`);
    return response;
  },

  async deleteByFiscalCode(
    fiscalCode: string
  ): Promise<FiscalcodeModel[] | null> {
    logger.info(`[START] deleteByFiscalcode for: ${fiscalCode}`);
    try {
      await FiscalCodeRepository.deleteByFiscalCode(fiscalCode);
      const response = await FiscalCodeRepository.findAll();
      logger.info(`[END] deleteByFiscalcode`);
      return response;
    } catch (error) {
      logger.error(
        `deleteByFiscalcode - Errore durante la cancellazione.`,
        error
      );
      throw error;
    }
  },
};
