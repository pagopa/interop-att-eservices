import { eq, desc } from "drizzle-orm";
import { dataPreparationTable } from "../../db/schema/digital-address-verification/data-preparation.model.js";
import { subjectDataResponsesTable } from "../../db/schema/digital-address-verification/subjectDataResponses.model.js";
import { digitalAddressesTable } from "../../db/schema/digital-address-verification/digital-address.model.js";
import { client, logger } from "../../index.js";

export const DataPreparationRepository = {
  async upsertDataPreparation(idSubject: string): Promise<void> {
    try {
      const insertData = {
        idSubject,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await client
        .insert(dataPreparationTable)
        .values(insertData)
        .onConflictDoUpdate({
          target: dataPreparationTable.idSubject,
          set: {
            updatedAt: new Date(),
          },
        });
    } catch (error: unknown) {
      logger.error(
        `[DataPreparationRepo] Error upserting data preparation for subject ${idSubject}.`,
        error
      );
      throw error;
    }
  },

  async findAllAggregatedData(): Promise<
    Array<{
      idSubject: string | null;
      from: Date | null;
      digitalAddressId: number | null;
      digitalAddressAddress: string | null;
      digitalAddressProfession: string | null;
      digitalAddressUsageReason:
        | "CESSAZIONE_UFFICIO"
        | "CESSAZIONE_VOLONTARIA"
        | null;
      digitalAddressUsageEndAt: Date | null;
      subjectDataResponseId: number | null;
    }>
  > {
    try {
      return await client
        .select({
          idSubject: dataPreparationTable.idSubject,
          from: subjectDataResponsesTable.dataFrom,
          digitalAddressId: digitalAddressesTable.id,
          digitalAddressAddress: digitalAddressesTable.address,
          digitalAddressProfession: digitalAddressesTable.profession,
          digitalAddressUsageReason: digitalAddressesTable.usageReason,
          digitalAddressUsageEndAt: digitalAddressesTable.usageEndAt,
          subjectDataResponseId: subjectDataResponsesTable.id,
        })
        .from(dataPreparationTable)
        .leftJoin(
          subjectDataResponsesTable,
          eq(
            dataPreparationTable.idSubject,
            subjectDataResponsesTable.subjectId
          )
        )
        .leftJoin(
          digitalAddressesTable,
          eq(
            subjectDataResponsesTable.id,
            digitalAddressesTable.subjectDataResponseId
          )
        )
        .orderBy(desc(subjectDataResponsesTable.dataFrom));
    } catch (error: unknown) {
      logger.error(
        `[DataPreparationRepo] Error finding all aggregated data.`,
        error
      );
      throw error;
    }
  },

  async findSingleAggregatedDataBySubjectId(fiscalCode: string): Promise<{
    subjectDataResponseRow: {
      id: number;
      listRequestId: string;
      subjectId: string;
      dataFrom: Date;
    };
    digitalAddressesResult: Array<{
      id: number;
      subjectDataResponseId: number;
      address: string;
      profession: string | null;
      usageReason: "CESSAZIONE_UFFICIO" | "CESSAZIONE_VOLONTARIA";
      usageEndAt: Date;
    }>;
  } | null> {
    try {
      const subjectResponseResult = await client
        .select()
        .from(subjectDataResponsesTable)
        .where(eq(subjectDataResponsesTable.subjectId, fiscalCode))
        .orderBy(desc(subjectDataResponsesTable.dataFrom))
        .limit(1);

      if (subjectResponseResult.length === 0) {
        return null;
      }

      const subjectDataResponseRow = subjectResponseResult[0];
      const subjectDataResponseId = subjectDataResponseRow.id;

      const digitalAddressesResult = await client
        .select()
        .from(digitalAddressesTable)
        .where(
          eq(digitalAddressesTable.subjectDataResponseId, subjectDataResponseId)
        );

      return {
        subjectDataResponseRow,
        digitalAddressesResult,
      };
    } catch (error) {
      logger.error(
        `[DataPreparationRepo] Error finding aggregated data for ${fiscalCode}.`,
        error
      );
      throw error;
    }
  },

  async deleteAll(): Promise<number> {
    try {
      const result = await client.delete(dataPreparationTable);
      return result.rowCount ?? 0;
    } catch (error) {
      logger.error(`[DataPreparationRepo] Error deleting all data.`, error);
      throw error;
    }
  },

  async deleteBySubjectId(fiscalCode: string): Promise<number> {
    try {
      const result = await client
        .delete(dataPreparationTable)
        .where(eq(dataPreparationTable.idSubject, fiscalCode));
      return result.rowCount ?? 0;
    } catch (error) {
      logger.error(
        `[DataPreparationRepo] Error deleting for ${fiscalCode}.`,
        error
      );
      throw error;
    }
  },
};
