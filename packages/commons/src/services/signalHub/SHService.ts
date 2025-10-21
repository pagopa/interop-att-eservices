import { logger } from "pdnd-common";
import axios from "axios";
import { SHRepository } from "../../repositories/singal-hub/SHRepository.js";

const SIGNAL_HUB_MOCKUP_URL = process.env.SIGNAL_HUB_MOCKUP_URL;
const SIGNAL_HUB_API_TOKEN = process.env.SIGNAL_HUB_API_TOKEN;

export interface SignalPayload {
  signalId: number;
  objectType: string | "";
  objectId: string | "";
  eserviceId: string | "";
  signalType: "UPDATE" | "DELETE" | "SEEDUPDATE";
}

export const SHService = {
  async sendSignal(payload: SignalPayload): Promise<void> {
    logger.info(`[SHService] Invio segnale (axios) per ${payload.objectId}`);

    if (!SIGNAL_HUB_MOCKUP_URL) {
      logger.error(
        "[SHService] SIGNAL_HUB_MOCKUP_URL non è configurato nel .env"
      );
      return;
    }

    if (!SIGNAL_HUB_API_TOKEN) {
      logger.error(
        "[SHService] SIGNAL_HUB_API_TOKEN non è configurato nel .env"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${SIGNAL_HUB_MOCKUP_URL}/push/signals`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${SIGNAL_HUB_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      const result = await SHRepository.findConfigByEserviceId(eserviceId);

      if (!result) {
        logger.error(`[SeedRepository] Seed non trovato per ${eserviceId}`);
        throw new Error(`Seed non configurato per l'e-service: ${eserviceId}`);
      }

      const seed = result.idSeed;

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
    return SHRepository.incrementAndGetSignalId(eserviceId);
  },
};
