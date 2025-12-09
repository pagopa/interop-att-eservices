import { buildPublicKeyService } from "../../aws-kms/publicKeyService.js";
import { buildSignerService } from "../../aws-kms/signerService.js";
import { getContext } from "../../context/context.js";
import { logger, SignerConfig } from "../../index.js";
import { testDbConnection } from "../../utility/testDbConnection.js";

export const HealtService = {
  async status(config: SignerConfig): Promise<boolean | null> {
    getContext();
    const publicKeyService = buildPublicKeyService(config);

    if (!(await publicKeyService.KMSAvailability(config.kmsKeyId))) {
      return false;
    }

    const signerService = buildSignerService(config);
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
