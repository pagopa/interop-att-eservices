import { logger, getContext } from "pdnd-common";
import { CategoryResponse, CheckResponse } from "../model/domain/models.js";
import checkService from "../services/checkService.js";
import categoryService from "../services/categoryService.js";

class TrialController {
  public appContext = getContext();

  public async findAllChecks(): Promise<CheckResponse[]> {
    try {
      return checkService.getAll();
    } catch (error) {
      logger.error(`Error during in method controller 'findAllChecks': ${error}`);
      throw error;
    }
  }
  
  public async findAllCategories(): Promise<CategoryResponse[]> {
    try {
      return categoryService.getAll();
    } catch (error) {
      logger.error(`Error during in method controller 'findAllChecks': ${error}`);
      throw error;
    }
  }
  
  public async findPaginatedTrials(): Promise<any> {
    try {
      return categoryService.getAll();
    } catch (error) {
      logger.error(`Error during in method controller 'findAllChecks': ${error}`);
      throw error;
    }
  }
  
}

export default new TrialController();
