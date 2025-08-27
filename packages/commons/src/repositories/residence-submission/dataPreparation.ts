import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js";

import {
  addressTable,
  subjectTable,
} from "../../db/schema/residence-verification/index.js";

import { Subject } from "../../db/schema/residence-verification/subject.model.js";
import { Address } from "../../db/schema/residence-verification/address.model.js";

export const DataPreparationRepository = {
  async findSubjectById(subjectId: string): Promise<Subject | null> {
    const result = await client
      .select()
      .from(subjectTable)
      .where(eq(subjectTable.subject_id, subjectId));
    return result.length > 0 ? result[0] : null;
  },

  async findAddressesBySubjectId(subjectId: string): Promise<Address[]> {
    return await client
      .select()
      .from(addressTable)
      .where(eq(addressTable.subject_id, subjectId));
  },

  async createSubject(data: Subject): Promise<void> {
    const result = await client.insert(subjectTable).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Subject record");
    }
  },

  async createAddress(data: Address): Promise<void> {
    const result = await client.insert(addressTable).values(data);
    if (result.rowCount === 0) {
      throw new Error("Failed to create a new Address record");
    }
  },

  async updateSubjectById(id: string, data: Subject): Promise<void> {
    const result = await client
      .update(subjectTable)
      .set(data)
      .where(eq(subjectTable.subject_id, id))
      .returning();
    if (!result || result.length === 0) {
      throw new Error(`No Subject found with id: ${id}`);
    }
  },

  async updateAddressById(subject_id: string, data: Address): Promise<void> {
    const result = await client
      .update(addressTable)
      .set(data)
      .where(eq(addressTable.subject_id, subject_id))
      .returning();
    if (!result || result.length === 0) {
      throw new Error(`No Address found with subject_id: ${subject_id}`);
    }
  },

  async deleteSubjectById(id: string): Promise<void> {
    const result = await client
      .delete(subjectTable)
      .where(eq(subjectTable.subject_id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Subject found with id: ${id}`);
    }
  },

  async deleteAddressById(id: string): Promise<void> {
    const result = await client
      .delete(addressTable)
      .where(eq(addressTable.id, id));
    if (result.rowCount === 0) {
      throw new Error(`No Address found with id: ${id}`);
    }
  },
};
