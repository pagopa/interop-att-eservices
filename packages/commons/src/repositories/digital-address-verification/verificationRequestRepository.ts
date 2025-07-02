/* eslint-disable prettier/prettier */
import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js";
import { verificationRequestsTable } from "../../db/schema/digital-address-verification/verifyRequest.model.js";
import { VerifyRequest } from "../../db/model/verifyRequest.js";
import { logger } from "../../index.js";


export class VerificationRequestRepository {
  private readonly db = client;

  public async save(data: VerifyRequest): Promise<void> {
    try {
      const insertData = {
        idRequest: data.idRequest,
        count: data.count,
        createdAt: new Date(),
        jsonRequest: data.jsonRequest,
        updatedAt: new Date(),
      };
      await this.db.insert(verificationRequestsTable).values(insertData);
    } catch (error: unknown) {
      logger.error(`[VerificationRequestRepo] Error saving request for id ${data.idRequest}.`, error);
      throw error;
    }
  }

  public async findById(id: string): Promise<VerifyRequest | null> {
    try {
      const result = await this.db
        .select()
        .from(verificationRequestsTable)
        .where(eq(verificationRequestsTable.idRequest, id))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const dbRecord = result[0];

      return {
        idRequest: dbRecord.idRequest,
        count: dbRecord.count,
        jsonRequest: JSON.stringify(dbRecord.jsonRequest),
      };
    } catch (error: unknown) {
      logger.error(`[VerificationRequestRepo] Error finding request by id ${id}.`, error);
      throw error;
    }
  }

  public async update(data: Pick<VerifyRequest, "idRequest" | "count">): Promise<void> {
    try {
      await this.db
        .update(verificationRequestsTable)
        .set({
          count: data.count,
          updatedAt: new Date(),
        })
        .where(eq(verificationRequestsTable.idRequest, data.idRequest));
    } catch (error: unknown) {
      logger.error(`[VerificationRequestRepo] Error updating request for id ${data.idRequest}.`, error);
      throw error;
    }
  }
}