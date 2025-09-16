import { buildPublicKeyService } from "../../aws-kms/publicKeyService.js";
import { buildSignerService } from "../../aws-kms/signerService.js";
import { signerConfig } from "../../config/signerConfig.js";
import { getContext } from "../../context/context.js";
import { logger } from "../../index.js";
import { testDbConnection } from "../../utility/testDbConnection.js";

export const HealtService = {
  appContext: getContext(),

  async status(): Promise<boolean | null> {
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
  },
};
