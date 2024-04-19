import { getContext } from "pdnd-common";
import healtRepository from "../repository/healtRepository.js";
import {
    signerConfig,
    buildPublicKeyService,
    buildSignerService, 
    logger
  } from "pdnd-common";
class healtService {
    appContext = getContext();

    public async statusRedis(): Promise<Boolean | null> {
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
        logger.info("status: OK")
        return true;
    }
  }
  
  export default new healtService();
