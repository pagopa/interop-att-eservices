import { logger } from "pdnd-common";
import { FiscalcodeModel, ErrorHandling } from "pdnd-models";
import fiscalCodeRepository from "../../repositories/fiscal-code-verification/fiscalCodeRepository.js";

export class FiscalCodeService {
  public async getByFiscalCode(
    fiscalCode: string
  ): Promise<FiscalcodeModel | null> {
    logger.info(`Searching for fiscal code model: ${fiscalCode}`);
    try {
      return await fiscalCodeRepository.findByFiscalCode(fiscalCode);
    } catch (error) {
      logger.error(
        `GenericFiscalCodeVerificationService: Errore durante la ricerca del codice fiscale.`,
        error
      );
      throw error;
    }
  }
  public async saveList(
    fiscalCodeModel: FiscalcodeModel
  ): Promise<FiscalcodeModel[] | null> {
    logger.info(
      `[START] datapreparation-saveList for: ${fiscalCodeModel.fiscalCode}`
    );
    try {
      await fiscalCodeRepository.save(fiscalCodeModel);
      const response = await fiscalCodeRepository.findAll();
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
  }

  public async getAll(): Promise<FiscalcodeModel[] | null> {
    logger.info(`[START] datapreparation-getAll`);
    const response = await fiscalCodeRepository.findAll();
    logger.info(`[END] datapreparation-getAll`);
    return response;
  }

  public async deleteAllByKey(): Promise<number | null> {
    logger.info(`[START] datapreparation-deleteAllByKey`);
    const response = await fiscalCodeRepository.deleteAll();
    logger.info(`[END] datapreparation-deleteAllByKey`);
    return response;
  }

  public async deleteByFiscalCode(
    fiscalCode: string
  ): Promise<FiscalcodeModel[] | null> {
    logger.info(`[START] deleteByFiscalcode for: ${fiscalCode}`);
    try {
      await fiscalCodeRepository.deleteByFiscalCode(fiscalCode);
      const response = await fiscalCodeRepository.findAll();
      logger.info(`[END] deleteByFiscalcode`);
      return response;
    } catch (error) {
      logger.error(
        `deleteByFiscalcode - Errore durante la cancellazione.`,
        error
      );
      throw error;
    }
  }
}
