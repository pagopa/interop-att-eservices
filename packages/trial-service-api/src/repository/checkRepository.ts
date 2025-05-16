import { db } from "trial";
import { Check, Category } from "trial";
import { eq } from "drizzle-orm";

export class CheckRepository {
  public static async findAllChecksWithCategories() {
    return await db
      .select({
        id: Check.id,
        code: Check.code,
        description: Check.description,
        order: Check.order,
        category_id: Check.category_id,
        category: {
          id: Category.id,
          code: Category.code,
          description: Category.description,
          order: Category.order,
          eservice: Category.eservice,
        }
      })
      .from(Check)
      .leftJoin(Category, eq(Check.category_id, Category.id));
  }
}