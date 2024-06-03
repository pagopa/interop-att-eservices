import { logger } from "pdnd-common";
import { CheckResponse } from "../model/domain/models.js";
import { checkToCheckResponse } from "../model/domain/apiConverter.js";
import { CheckRepository } from "../repository/checkRepository.js";

class CheckService {
  public async getAll(): Promise<CheckResponse[]> {
    try {
      const response: CheckResponse[] = [];
      const allChecks = await CheckRepository.findAllChecksWithCategories();
      allChecks.forEach((c) => {
        response.push(checkToCheckResponse(c));
      });
      return response;
    } catch (error) {
      logger.error(`CheckService - getAll - generic error: ${error}`);
      throw error;
    }
  }
}

export default new CheckService();
