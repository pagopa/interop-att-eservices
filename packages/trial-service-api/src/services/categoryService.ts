import { logger } from "pdnd-common";
import { CategoryResponse } from "../model/domain/models.js";
import { categoryToCategoryResponse } from "../model/domain/apiConverter.js";
import { Category } from "trial";

class CategoryService {

  public async getAll(): Promise<CategoryResponse[]> {
    try {
      var response: CategoryResponse[] = [];
      const allCategories = await Category.findAll();
      logger.info("CategoryService - getAll - All categories retrieved successfully")
      allCategories.forEach((c) => {
        response.push(categoryToCategoryResponse(c));
      })
      return response;
    } catch (error) {
      logger.error(`CategoryService - getAll - Generic error: ${error}`);
      throw error;
    }
  }
}

export default new CategoryService();
