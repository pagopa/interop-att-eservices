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
    logger.info(`[SHService] Sending signal (axios) for ${payload.objectId}`);

    if (!config.signalHubHost) {
      logger.error(
        "[SHService] SIGNAL_HUB_MOCKUP_URL is not configured in .env"
      );
      return;
    }

    if (!pdndToken) {
      logger.error(
        "[SHService] SIGNAL_HUB_API_TOKEN is not configured in .env"
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
        `[ANPRService] Signal sent successfully. Status: ${response.status}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[ANPRService] API Error: ${error.response?.status} - ${error.message}`
        );
      } else {
        const errorMessage = (error as Error).message || String(error);
        logger.error(`[ANPRService] Connection Error: ${errorMessage}`);
      }
    }
  },

  async findSeedByEserviceId(eserviceId: string): Promise<string> {
    logger.info(
      `[SeedRepository] Searching for seed for e-service: ${eserviceId}`
    );

    try {
      const seed = await SHRepository.findConfigByEserviceId(eserviceId);
      if (!seed) {
        logger.error(
          `[SeedRepository] 'seed' field is null in JSONB for ${eserviceId}`
        );
        throw new Error(`Null or malformed seed in JSONB for ${eserviceId}`);
      }

      return seed;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(`[SeedRepository] DB Error: ${errorMessage}`);
      throw new Error("Error retrieving seed from DB.");
    }
  },

  async getNextSignalId(eserviceId: string): Promise<number> {
    logger.info(`[SHService] Requesting signalId increment for ${eserviceId}`);
    return SHRepository.ensureAndIncrementSignalId(eserviceId);
  },
};
