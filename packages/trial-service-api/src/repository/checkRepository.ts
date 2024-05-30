import { Category, Check } from "trial";

export class CheckRepository {

  public static async findAllChecksWithCategories(): Promise<Check[]> {
    return await Check.findAll({
      include: [{
        model: Category,
        as: 'category'
      }]
    });
  }

}

