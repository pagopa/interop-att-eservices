import { getContext } from "pdnd-common";
import {
  signerConfig,
  buildPublicKeyService,
  buildSignerService,
  logger,
} from "pdnd-common";
import { sequelize } from "trial";
import healtRepository from "../repository/healtRepository.js";

class healtService {
  public appContext = getContext();

  public async status(): Promise<boolean | null> {
    const config = signerConfig();

    if (!(await healtRepository.checkConnection())) {
      return false;
    }
    /* const config = signerConfig.parse(process.env); */
    const publicKeyService = buildPublicKeyService();

    // Recupera il kid dal token JWT
    if (!(await publicKeyService.KMSAvailability(config.kmsKeyId))) {
      return false;
    }
    const signerService = buildSignerService();
    if (!(await signerService.KMSAvailability(config.kmsKeyId, "token"))) {
      return false;
    }

    try {
      // Prova a connetterti al database
      await sequelize.authenticate();
    } catch (error) {
      // Se c'è un errore nella connessione, invia una risposta negativa
      logger.error(`Errore nella connessione al database: ${error}`);
      return false;
    }
    logger.info("status: OK");

    return true;
  }
}

export default new healtService();
