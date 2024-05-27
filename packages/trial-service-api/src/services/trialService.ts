import { logger } from "pdnd-common";
import { Trial } from "trial";

class TrialService {

  public async getPaginatedTrial(purpose_id: string, correlation_id: string): Promise<Trial[]> {
    try {
        //TODO: FARE IMPLEMENTAZIONE TRIAL PAGINATA
        logger.info(`${purpose_id} --- ${correlation_id}`);
        return [];
    } catch (error) {
      logger.error(`getAll - generic error during Check findAll: ${error}`);
      throw error;
    }
  }
}

export default new TrialService();
