import { eq } from "drizzle-orm";
import { db } from "../model/db/index.js";
import { Purpose } from "../model/db/purposes.model.js";

class DataPreparationRepository {
  public async findByUuid(uuid: string): Promise<any | null> {
    return await db.select().from(Purpose).where(eq(Purpose.id, uuid));
  }

  public async updateSubjectByUuid(uuid: string, data: any): Promise<void> {
    const result = await db
      .update(Purpose)
      .set(data)
      .where(eq(Purpose.id, uuid));

    if (result.rowCount === 0) {
      throw new Error(`No subject found with UUID: ${uuid}`);
    }
  }

  public async createSubject(data: any): Promise<void> {
    const result = await db
    .insert(Purpose)
    .values(data);

    if (result.rowCount === 0) {
      throw new Error("Failed to create a new record");
    }
  }
}

export default new DataPreparationRepository();
