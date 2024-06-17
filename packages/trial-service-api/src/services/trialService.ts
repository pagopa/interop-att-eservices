import { logger } from "pdnd-common";
import { PaginatedTrialResponse } from "../model/domain/models.js";
import { TrialRepository } from "../repository/trialRepository.js";

class TrialService {
  public async getPaginatedTrial(
    page: number,
    pageSize: number,
    purposeId: string,
    correlationId?: string,
    path?: string,
    method?: string
    
  ): Promise<PaginatedTrialResponse> {
    try {
      return await TrialRepository.findPaginatedTrial(
        page,
        pageSize,
        purposeId,
        correlationId,
        path,
        method
      );
    } catch (error) {
      logger.error(`GetAll - generic error during Check 'findAll': ${error}`);
      throw error;
    }
  }
}

export default new TrialService();
