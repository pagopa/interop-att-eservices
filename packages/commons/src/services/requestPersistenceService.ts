import { logger } from "pdnd-common";
import { eq } from "drizzle-orm";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { client } from "../db/postgres/client.js";
import { verificationRequestsTable } from "../db/schema/verifyRequest.model.js";
import { VerifyRequest } from "../db/model/verifyRequest.js";
import { dataPreparationTable } from "../db/schema/data-preparation.model.js";

export class PersistenceService {
  public async saveVerificationRequest(data: VerifyRequest): Promise<void> {
    try {
      await client.insert(verificationRequestsTable).values({
        idRequest: data.idRequest,
        count: data.count,
        createdAt: new Date(),
        jsonRequest: data.jsonRequest,
      });
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante saveVerificationRequest per id ${data.idRequest}.`,
        error
      );
      throw error;
    }
  }

  public async findVerificationRequestById(
    id: string
  ): Promise<VerifyRequest | null> {
    try {
      const result = await client
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
        jsonRequest: dbRecord.jsonRequest as string,
      };
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante findVerificationRequestById per id ${id}.`,
        error
      );
      throw error;
    }
  }

  public async updateVerificationRequest(
    data: Pick<VerifyRequest, "idRequest" | "count">
  ): Promise<void> {
    try {
      await client
        .update(verificationRequestsTable)
        .set({
          count: data.count,
          updatedAt: new Date(),
        })
        .where(eq(verificationRequestsTable.idRequest, data.idRequest));
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante updateVerificationRequest per id ${data.idRequest}.`,
        error
      );
      throw error;
    }
  }

  public async saveDataPreparationList(
    data: ResponseRequestDigitalAddressModel[]
  ): Promise<void> {
    try {
      if (data.length === 0) {
        return;
      }

      const dataToUpsert = data.map((item) => ({
        idSubject: item.idSubject,
        data: item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await client.transaction(async (tx) => {
        for (const item of dataToUpsert) {
          await tx
            .insert(dataPreparationTable)
            .values(item)
            .onConflictDoUpdate({
              target: dataPreparationTable.idSubject,
              set: {
                data: item.data,
                updatedAt: new Date(),
              },
            });
        }
      });
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante saveDataPreparationList.`,
        error
      );
      throw error;
    }
  }

  public async findAllDataPreparation(): Promise<
    ResponseRequestDigitalAddressModel[] | null
  > {
    try {
      const results = await client.select().from(dataPreparationTable);

      if (results.length === 0) {
        return null;
      }

      return results.map(
        (dbRecord) => dbRecord.data as ResponseRequestDigitalAddressModel
      );
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante findAllDataPreparation.`,
        error
      );
      throw error;
    }
  }

  public async findSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      const result = await client
        .select()
        .from(dataPreparationTable)
        .where(eq(dataPreparationTable.idSubject, fiscalCode))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      return result[0].data as ResponseRequestDigitalAddressModel;
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante findSingleDataPreparationByFiscalCode per fiscalCode '${fiscalCode}'.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllDataPreparation(): Promise<number> {
    try {
      const result = await client.delete(dataPreparationTable);
      return result.rowCount ?? 0;
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante deleteAllDataPreparation.`,
        error
      );
      throw error;
    }
  }

  public async deleteSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<number> {
    try {
      const result = await client
        .delete(dataPreparationTable)
        .where(eq(dataPreparationTable.idSubject, fiscalCode));

      return result.rowCount ?? 0;
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Errore durante deleteSingleDataPreparationByFiscalCode per fiscalCode '${fiscalCode}'.`,
        error
      );
      throw error;
    }
  }
}
