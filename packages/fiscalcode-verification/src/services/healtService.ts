import { getContext } from "pdnd-common";
import {
  signerConfig,
  buildPublicKeyService,
  buildSignerService,
  logger,
  sendCustomEvent
} from "pdnd-common";
import axios, { AxiosResponse } from "axios";
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
    if (!(await checkStatusInteropAuth())) {
      return false;
    }
    if (!(await checkStatusinterop())) {
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
    // Utilizzo della funzione sendCustomEvent
    logger.info("send event");

    sendCustomEvent('customEvent', { data: 'Dati correlati all\'evento' });
    logger.info("donedone");

    return true;
  }
}

async function checkStatusInteropAuth(): Promise<boolean> {
  try {
    /* eslint-disable */
    const response: AxiosResponse<any> = await axios.get(
      "https://auth.uat.interop.pagopa.it/status"
    );
    /* eslint-enable */
    return response.status === 200;
  } catch (error) {
    logger.error(`Error: https://auth.uat.interop.pagopa.it/status ${error}`);
    return false;
  }
}

async function checkStatusinterop(): Promise<boolean> {
  try {
    /* eslint-disable */
    const response: AxiosResponse<any> = await axios.get(
      "https://api.att.interop.pagopa.it/1.0/status"
    );
    /* eslint-enable */
    return response.status === 200;
  } catch (error) {
    logger.error(
      `Error: https://api.att.interop.pagopa.it/1.0/status ${error}`
    );
    return false;
  }
}
export default new healtService();
