import {
  buildPublicKeyService,
  buildSignerService,
  logger,
  testDbConnection,
} from "pdnd-common";
import { residenceSubmissionConfig } from "../config/config.js";

class HealtService {
  public async status(): Promise<boolean | null> {
    const publicKeyService = buildPublicKeyService(residenceSubmissionConfig);

    if (
      !(await publicKeyService.KMSAvailability(
        residenceSubmissionConfig.kmsKeyId
      ))
    ) {
      return false;
    }
    const signerService = buildSignerService(residenceSubmissionConfig);
    if (
      !(await signerService.KMSAvailability(
        residenceSubmissionConfig.kmsKeyId,
        "token"
      ))
    ) {
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
