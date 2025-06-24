import { logger } from "pdnd-common";
import { db } from "trial"; // Drizzle db instance
import { Category } from "trial"; // Drizzle model
import { CategoryResponse } from "../model/domain/models.js";
import { categoryToCategoryResponse } from "../model/domain/apiConverter.js";

class CategoryService {
  public async getAll(): Promise<CategoryResponse[]> {
    try {
      const allCategories = await db.select().from(Category);

      logger.info(
        "CategoryService - getAll - All categories retrieved successfully"
      );

      return allCategories.map(categoryToCategoryResponse);
    } catch (error) {
      logger.error(`CategoryService - getAll - Generic error: ${error}`);
      throw error;
    }
  }
}

export default new CategoryService();
