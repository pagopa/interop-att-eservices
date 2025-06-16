// NOME FILE: digitalAddressRepository.ts

import { logger, persistenceService } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
class DigitalAddressRepository {
  // Il costruttore non serve più

  public async saveRequest(
    genericRequest: VerifyRequest[],
    key: string
  ): Promise<string | null> {
    return persistenceService.saveDigitalAddressList(
      genericRequest as unknown as ResponseRequestDigitalAddressModel[],
      key
    );
  }

  public async findAllByKey(key: string): Promise<VerifyRequest[] | null> {
    const data = await persistenceService.findAllDigitalAddressesByPurpose(key);
    return data as unknown as VerifyRequest[];
  }

  public async findByIdRequest(
    key: string,
    fiscalCode: string
  ): Promise<VerifyRequest | null> {
    logger.info(`Ricerca per fiscalCode: ${fiscalCode}`);

    // --- OTTIMIZZATO ---
    // Invece di caricare tutta la lista, cerchiamo direttamente il singolo record.
    const data = await persistenceService.findSingleDigitalAddressByPurpose(
      key,
      fiscalCode
    );
    return data as unknown as VerifyRequest | null;
  }

  public async deleteAllByKey(key: string): Promise<number | null> {
    // --- OTTIMIZZATO ---
    // La logica di controllo è stata rimossa perché il persistenceService
    // già gestisce la cancellazione in modo atomico.
    return persistenceService.deleteAllDigitalAddressesByPurpose(key);
  }
}

export default new DigitalAddressRepository();
