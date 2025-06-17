import { logger, getContext } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";

import {
  appendUniqueFiscalcodeModelsToArray,
  deleteFiscalcodeModelByFiscaldode,
  findFiscalcodeModelByFiscalcode,
} from "../utilities/fiscalcodeUtilities.js";

class DataPreparationService {
  public appContext = getContext();
  public eService: string = "digital-address-verification";
  public purposeId = this.appContext.authData.purposeId;
  public async saveList(
    fiscalCodeModel: ResponseRequestDigitalAddressModel
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      logger.info(`[START] datapreparation-saveList`);
      const fiscalCodeData: ResponseRequestDigitalAddressModel[] = [
        fiscalCodeModel,
      ];

      // const hash = generateHash([
      //   this.eService,
      //   this.appContext.authData.purposeId,
      // ]);

      const persistedFiscalcodeData =
        await dataPreparationRepository.findAllByKey(this.purposeId);

      if (
        persistedFiscalcodeData == null ||
        persistedFiscalcodeData.length === 0
      ) {
        await dataPreparationRepository.saveList(
          fiscalCodeData,
          this.purposeId
        );
        logger.info(`[END] datapreparation-saveList`);
        return null;
      }

      const allFiscalcode = appendUniqueFiscalcodeModelsToArray(
        persistedFiscalcodeData,
        fiscalCodeData
      );

      await dataPreparationRepository.saveList(allFiscalcode, this.purposeId);
      const response = await dataPreparationRepository.findAllByKey(
        this.purposeId
      );
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

  public async getAll(): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      logger.info(`[START] datapreparation-getAll`);
      // const hash = generateHash([
      //   this.eService,
      //   this.appContext.authData.purposeId,
      // ]);
      const response = await dataPreparationRepository.findAllByKey(
        this.purposeId
      );
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
      // const hash = generateHash([
      //   this.eService,
      //   this.appContext.authData.purposeId,
      // ]);
      const response = await dataPreparationRepository.deleteAllByKey(
        this.purposeId
      );
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
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      logger.info(`[START] deleteByFiscalcode`);
      // const hash = generateHash([
      //   this.eService,
      //   this.appContext.authData.purposeId,
      // ]);
      const allSaved = await dataPreparationRepository.findAllByKey(
        this.purposeId
      );
      const fiscaldode = deleteFiscalcodeModelByFiscaldode(allSaved, uuid);
      await this.deleteAllByKey();
      if (fiscaldode) {
        await dataPreparationRepository.saveList(fiscaldode, this.purposeId);
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

  public async findByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      logger.info(`[START] findByFiscalCode`);
      // const hash = generateHash([
      //   this.eService,
      //   this.appContext.authData.purposeId,
      // ]);
      const allSaved = await dataPreparationRepository.findAllByKey(
        this.purposeId
      );
      const fiscaldode = findFiscalcodeModelByFiscalcode(allSaved, fiscalCode);
      if (fiscaldode) {
        return fiscaldode;
      }
      logger.info(`[END] findByFiscalCode`);
      return null;
    } catch (error) {
      logger.error(
        `findByFiscalCode - Errore durante il recupero della lista.`,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationService();
