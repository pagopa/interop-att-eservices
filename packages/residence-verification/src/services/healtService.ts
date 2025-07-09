import {
  signerConfig,
  buildPublicKeyService,
  buildSignerService,
  logger,
  getContext,
} from "pdnd-common";
import { testDbConnection } from "trial";

class HealtService {
  public appContext = getContext();

  public async status(): Promise<boolean | null> {
    const config = signerConfig();

    const publicKeyService = buildPublicKeyService();

    if (!(await publicKeyService.KMSAvailability(config.kmsKeyId))) {
      return false;
    }
    const signerService = buildSignerService();
    if (!(await signerService.KMSAvailability(config.kmsKeyId, "token"))) {
      return false;
    }

    try {
      await testDbConnection();
    } catch (error) {
      logger.error(`Errore nella connessione al database: ${error}`);
      return false;
    }
    logger.info("status: OK");

    return true;
  }
}

export default new HealtService();
