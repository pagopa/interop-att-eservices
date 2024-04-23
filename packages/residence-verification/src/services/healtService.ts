import { getContext } from "pdnd-common";
import healtRepository from "../repository/healtRepository.js";
import {
    signerConfig,
    buildPublicKeyService,
    buildSignerService, 
    logger
  } from "pdnd-common";
  import axios, { AxiosResponse } from "axios";

class healtService {
    appContext = getContext();

    public async status(): Promise<Boolean | null> {
                  const config = signerConfig();

        if (!await healtRepository.checkConnection()) {
            return false;
        }
        /* const config = signerConfig.parse(process.env); */
        const publicKeyService = buildPublicKeyService();
          
        // Recupera il kid dal token JWT
        if (! await publicKeyService.KMSAvailability(config.kmsKeyId)) {
            return false;
        }
        const signerService = buildSignerService();
        if (! await signerService.KMSAvailability(config.kmsKeyId, "token")) {
            return false;
        }
        if (! await checkStatusInteropAuth()) {
            return false;
        }
        if (! await checkStatusinterop()) {
            return false;
        }
        logger.info("status: OK")
        return true;
    }
  }

  async function checkStatusInteropAuth(): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await axios.get("https://auth.uat.interop.pagopa.it/status");
      return response.status === 200;
    } catch (error) {
        logger.error(`Error: https://auth.uat.interop.pagopa.it/status ${error}`)
      return false;
    }
  }
  
  async function checkStatusinterop(): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await axios.get("https://api.att.interop.pagopa.it/1.0/status");
      return response.status === 200;
    } catch (error) {
        logger.error(`Error: https://api.att.interop.pagopa.it/1.0/status ${error}`)
      return false;
    }
  }
  export default new healtService();
