// NOME FILE: dataPreparationRepository.ts

import { logger, persistenceService } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
// Importa l'ISTANZA UNICA del persistenceService, non la classe

class DataPreparationRepository {
  // Il costruttore non serve più

  public async saveList(
    genericRequest: ResponseRequestDigitalAddressModel[],
    key: string
  ): Promise<string | null> {
    // Chiama direttamente l'istanza importata
    logger.info(`generic request ${JSON.stringify(genericRequest)}`);
    return persistenceService.saveDataPreparationList(genericRequest, key);
  }

  public async findAllByKey(
    key: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    return persistenceService.findAllDataPreparationByPurpose(key);
  }

  public async findByPurposeId(
    key: string,
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    return persistenceService.findSingleDataPreparationByFiscalCode(
      key,
      fiscalCode
    );
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    await persistenceService.deleteAllDataPreparationByPurpose(key);
    return 0;
  }
}

export default new DataPreparationRepository();
