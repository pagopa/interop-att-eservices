import { logger, persistenceService } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { findRequestlByIdRequest } from "../utilities/verifyRequestUtilities.js";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";

class digitalAddressRepository {
  public async saveRequest(
    genericRequest: VerifyRequest[],
    key: string
  ): Promise<string | null> {
    try {
      const savedListId = await persistenceService.saveDigitalAddressList(
        genericRequest as unknown as ResponseRequestDigitalAddressModel[],
        key
      );
      logger.info(`DigitalAddressRepository: Elemento salvato con successo.`);
      return savedListId;
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il salvataggio del' elemento: `,
        error
      );
      throw error;
    }
  }

  public async findAllByKey(key: string): Promise<VerifyRequest[] | null> {
    try {
      const dataSaved =
        await persistenceService.findAllDigitalAddressesByPurpose(key);
      logger.info(
        `DigitalAddressRepository: Elemento recuperato con successo.`
      );
      return dataSaved as unknown as VerifyRequest[];
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error;
    }
  }

  public async findByIdRequest(
    key: string,
    fiscalCode: string
  ): Promise<VerifyRequest | null> {
    try {
      logger.info(fiscalCode);
      const datas = await persistenceService.findAllDigitalAddressesByPurpose(
        key
      );
      logger.info(
        `DigitalAddressRepository: Elemento recuperato con successo.`
      );
      return findRequestlByIdRequest(
        datas as unknown as VerifyRequest[],
        fiscalCode
      );
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante il recupero dell'elemento: `,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    try {
      await persistenceService.deleteAllDigitalAddressesByPurpose(key);
      const dataSaved =
        await persistenceService.findAllDigitalAddressesByPurpose(key);
      const arrayDataSaved = dataSaved as unknown as VerifyRequest[];
      if (arrayDataSaved == null || arrayDataSaved.length === 0) {
        return 0;
      } else {
        return arrayDataSaved.length;
      }
    } catch (error) {
      logger.error(
        `DigitalAddressRepository: Errore durante la cancellazione dell'elemento: `,
        error
      );
      throw error;
    }
  }
}

export default new digitalAddressRepository();
