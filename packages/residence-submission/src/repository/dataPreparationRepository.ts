import { eq } from "drizzle-orm";
import { db } from "../model/db/index.js";

// TODO: these models need to be fixed
import { Subject } from "../model/db/subjects.model.js";
import { Purpose } from "../model/db/purposes.model.js";
import { Address } from "../model/db/addresses.model.js";
import { Usecase } from "../model/db/usecases.model.js";

class DataPreparationRepository {
  // READ METHODS
  public async findSubjectById(subjectId: string): Promise<Subject | null> {
    const result = await db
      .select()
      .from(Subject)
      .where(eq(Subject.subject_id, subjectId));
    return result.length > 0 ? result[0] : null;
  }

  public async findUsecasesById(subjectId: string): Promise<Usecase[]> {
    const result = await db
      .select()
      .from(Usecase)
      .where(eq(Usecase.subject_id, subjectId));
    return result;
  }

  // CREATE METHODS
  public async createPurpose(data: any): Promise<void> {
    const result = await db.insert(Purpose).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Purpose record");
    }
  }

  public async createSubject(data: any): Promise<void> {
    const result = await db.insert(Subject).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Subject record");
    }
  }

  public async createAddress(data: any): Promise<void> {
    const result = await db.insert(Address).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Address record");
    }
  }

  public async createUsecase(data: any): Promise<void> {
    const result = await db.insert(Usecase).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Usecase record");
    }
  }

  // UPDATE METHODS
  public async updatePurposeById(id: string, data: any): Promise<void> {
    const result = await db
      .update(Purpose)
      .set(data)
      .where(eq(Purpose.id, id))
      .returning();
    if (!result || result.length === 0) {
      throw new Error(`No Purpose found with id: ${id}`);
    }
  }

  public async updateSubjectById(id: string, data: any): Promise<void> {
    const result = await db
      .update(Subject)
      .set(data)
      .where(eq(Subject.subject_id, id))
      .returning();
    if (!result || result.length === 0) {
      throw new Error(`No Subject found with id: ${id}`);
    }
  }

  public async updateAddressById(id: string, data: any): Promise<void> {
    const result = await db
      .update(Address)
      .set(data)
      .where(eq(Address.id, id))
      .returning();
    if (!result || result.length === 0) {
      throw new Error(`No Address found with id: ${id}`);
    }
  }

  // DELETE METHODS
  public async deleteUsecaseById(id: string): Promise<void> {
    const result = await db.delete(Usecase).where(eq(Usecase.id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Usecase found with id: ${id}`);
    }
  }

  public async deleteSubjectById(id: string): Promise<void> {
    const result = await db.delete(Subject).where(eq(Subject.subject_id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Subject found with id: ${id}`);
    }
  }

  public async deleteAddressById(id: string): Promise<void> {
    const result = await db.delete(Address).where(eq(Address.id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Address found with id: ${id}`);
    }
  }

  public async deletePurposeById(id: string): Promise<void> {
    const result = await db.delete(Purpose).where(eq(Purpose.id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Purpose found with id: ${id}`);
    }
  }
}

export default new DataPreparationRepository();
