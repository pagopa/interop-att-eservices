import { logger, persistenceService } from "pdnd-common";
import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";

class DigitalAddressVerificationRepository {
  public async save(request: VerifyRequest): Promise<void> {
    logger.info(
      `[REPOSITORY] Inoltro richiesta di salvataggio per id: ${request.idRequest}`
    );
    return persistenceService.saveVerificationRequest(request);
  }

  public async findById(id: string): Promise<VerifyRequest | null> {
    logger.info(`[REPOSITORY] Inoltro richiesta di ricerca per id: ${id}`);
    return persistenceService.findVerificationRequestById(id);
  }

  public async update(request: VerifyRequest): Promise<void> {
    logger.info(
      `[REPOSITORY] Inoltro richiesta di aggiornamento per id: ${request.idRequest}`
    );
    return persistenceService.updateVerificationRequest(request);
  }
}

export default new DigitalAddressVerificationRepository();
