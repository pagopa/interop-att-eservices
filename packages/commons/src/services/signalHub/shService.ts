import axios from "axios";
import { SHRepository } from "../../repositories/signalHub/index.js";
import { logger } from "../../index.js";
import { shClientConfig } from "../../config/shClientConfig.js";

const config = shClientConfig();
export interface SignalPayload {
  signalId: number;
  objectType: string | "";
  objectId: string | "";
  eserviceId: string | "";
  signalType: "UPDATE" | "DELETE" | "SEEDUPDATE";
}

export const SHService = {
  async sendSignal(payload: SignalPayload, pdndToken: string): Promise<void> {
    logger.info(`[SHService] Invio segnale (axios) per ${payload.objectId}`);

    if (!config.signalHubHost) {
      logger.error(
        "[SHService] SIGNAL_HUB_MOCKUP_URL non è configurato nel .env"
      );
      return;
    }

    if (!pdndToken) {
      logger.error(
        "[SHService] SIGNAL_HUB_API_TOKEN non è configurato nel .env"
      );
      return;
    }

    try {
      const apiUrl = `${config.signalHubHost}/${config.signalHubApiVersion}/push/signals`;
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${pdndToken}`,
          "Content-Type": "application/json",
        },
      });

      logger.info(
        `[ANPRService] Segnale inviato con successo. Status: ${response.status}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[ANPRService] Errore API: ${error.response?.status} - ${error.message}`
        );
      } else {
        const errorMessage = (error as Error).message || String(error);
        logger.error(`[ANPRService] Errore di connessione: ${errorMessage}`);
      }
    }
  },

  async findSeedByEserviceId(eserviceId: string): Promise<string> {
    logger.info(`[SeedRepository] Ricerca seed per e-service: ${eserviceId}`);

    try {
      const seed = await SHRepository.findConfigByEserviceId(eserviceId);
      if (!seed) {
        logger.error(
          `[SeedRepository] Campo 'seed' nullo nel JSONB per ${eserviceId}`
        );
        throw new Error(`Seed nullo o malformato nel JSONB per ${eserviceId}`);
      }

      return seed;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(`[SeedRepository] Errore DB: ${errorMessage}`);
      throw new Error("Errore durante il recupero del seed dal DB.");
    }
  },
  async getNextSignalId(eserviceId: string): Promise<number> {
    logger.info(`[SHService] Richiesta incremento signalId per ${eserviceId}`);
    return SHRepository.ensureAndIncrementSignalId(eserviceId);
  },
};
