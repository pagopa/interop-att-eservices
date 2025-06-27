import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";
import {
  ResponseRequestDigitalAddressModel,
  ElementDigitalAddressModel,
  UsageInfoModel,
} from "pdnd-models";
import { client } from "../../db/postgres/client.js";
import { verificationRequestsTable } from "../../db/schema/digital-address-verification/verifyRequest.model.js";
import { VerifyRequest } from "../../db/model/verifyRequest.js";
import { dataPreparationTable } from "../../db/schema/digital-address-verification/data-preparation.model.js";
import { listRequestsTable } from "../../db/schema/digital-address-verification/listRequest.model.js";
import { requestSubjectsTable } from "../../db/schema/digital-address-verification/requestSubjects.model.js";
import { subjectDataResponsesTable } from "../../db/schema/digital-address-verification/subjectDataResponses.model.js";
import { digitalAddressesTable } from "../../db/schema/digital-address-verification/digital-address.model.js";
import { logger } from "../../index.js";

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
        `[PERSISTENCE] Error during saveVerificationRequest for id ${data.idRequest}.`,
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
        jsonRequest: JSON.stringify(dbRecord.jsonRequest),
      };
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Error during findVerificationRequestById for id ${id}.`,
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
        `[PERSISTENCE] Error during updateVerificationRequest for id ${data.idRequest}.`,
        error
      );
      throw error;
    }
  }

  public async saveDataPreparationList(
    data: ResponseRequestDigitalAddressModel[]
  ): Promise<string> {
    try {
      if (data.length === 0) {
        throw new Error("Cannot save an empty list of data.");
      }
      await client.transaction(async (tx) => {
        const [insertedListRequest] = await tx
          .insert(listRequestsTable)
          .values({
            id: uuidv4(),
            submittedRequestId: uuidv4(),
            status: "PRESA_IN_CARICO",
            createdAt: new Date(),
          })
          .returning({ id: listRequestsTable.id });

        if (!insertedListRequest?.id) {
          throw new Error(
            "Failed to insert main list request into list_requestsTable."
          );
        }

        const currentListRequestId = insertedListRequest.id;

        for (const item of data) {
          await tx
            .insert(dataPreparationTable)
            .values({
              idSubject: item.idSubject,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: dataPreparationTable.idSubject,
              set: {
                updatedAt: new Date(),
              },
            });
          await tx
            .insert(requestSubjectsTable)
            .values({
              listRequestId: currentListRequestId,
              subjectId: item.idSubject,
            })
            .onConflictDoNothing();

          const [sdrUpsertResult] = await tx
            .insert(subjectDataResponsesTable)
            .values({
              listRequestId: currentListRequestId,
              subjectId: item.idSubject,
              dataFrom: new Date(item.from),
            })
            .onConflictDoUpdate({
              target: [
                subjectDataResponsesTable.listRequestId,
                subjectDataResponsesTable.subjectId,
              ],
              set: {
                dataFrom: new Date(item.from),
              },
            })
            .returning({ id: subjectDataResponsesTable.id });

          if (!sdrUpsertResult?.id) {
            throw new Error(
              "Failed to obtain subject data response ID after upsert."
            );
          }
          const subjectDataResponseIdToUse = sdrUpsertResult.id;

          await tx
            .delete(digitalAddressesTable)
            .where(
              eq(
                digitalAddressesTable.subjectDataResponseId,
                subjectDataResponseIdToUse
              )
            );

          for (const digitalAddress of item.digitalAddress) {
            await tx.insert(digitalAddressesTable).values({
              subjectDataResponseId: subjectDataResponseIdToUse,
              address: digitalAddress.digitalAddress,
              profession: digitalAddress.profession,
              usageReason: digitalAddress.information.reason,
              usageEndAt: digitalAddress.information.endDate
                ? new Date(digitalAddress.information.endDate)
                : new Date("9999-12-31T23:59:59Z"),
            });
          }
        }
      });

      return "Data preparation list saved successfully.";
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Error during saveDataPreparationList.`,
        error
      );

      throw error;
    }
  }

  public async findAllDataPreparation(): Promise<
    ResponseRequestDigitalAddressModel[] | null
  > {
    try {
      const results = await client
        .select({
          idSubject: dataPreparationTable.idSubject,
          from: subjectDataResponsesTable.dataFrom,
          digitalAddressId: digitalAddressesTable.id,
          digitalAddressAddress: digitalAddressesTable.address,
          digitalAddressProfession: digitalAddressesTable.profession,
          digitalAddressUsageReason: digitalAddressesTable.usageReason,
          digitalAddressUsageEndAt: digitalAddressesTable.usageEndAt,
          subjectDataResponseId: subjectDataResponsesTable.id,
          // sdrCreatedAt: subjectDataResponsesTable.createdAt,
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

      if (results.length === 0) {
        return null;
      }
      const groupedData = new Map<string, ResponseRequestDigitalAddressModel>();

      for (const row of results) {
        const {
          idSubject,
          from,
          digitalAddressId,
          digitalAddressAddress,
          digitalAddressProfession,
          digitalAddressUsageReason,
          digitalAddressUsageEndAt,
          subjectDataResponseId,
          // sdrCreatedAt,
        } = row;

        if (!idSubject || !from || !subjectDataResponseId) {
          continue;
        }

        const subjectEntry =
          groupedData.get(idSubject) ??
          ((): ResponseRequestDigitalAddressModel => {
            const entry = {
              idSubject,
              from: from.toISOString(),
              digitalAddress: [],
            };
            groupedData.set(idSubject, entry);
            return entry;
          })();

        if (
          digitalAddressId &&
          digitalAddressAddress &&
          digitalAddressUsageReason
        ) {
          const usageInfo: UsageInfoModel = {
            reason: digitalAddressUsageReason,
            endDate: digitalAddressUsageEndAt
              ? digitalAddressUsageEndAt.toISOString()
              : "9999-12-31T23:59:59.000Z",
          };
          const elementDigitalAddress: ElementDigitalAddressModel = {
            digitalAddress: digitalAddressAddress,
            profession: digitalAddressProfession || undefined,
            information: usageInfo,
          };
          groupedData.set(idSubject, {
            ...subjectEntry,
            digitalAddress: [
              ...subjectEntry.digitalAddress,
              elementDigitalAddress,
            ],
          });
        }
      }

      return Array.from(groupedData.values());
    } catch (error) {
      logger.error(`[PERSISTENCE] Error during findAllDataPreparation.`, error);
      throw error;
    }
  }

  public async findSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    logger.info(`[PERSISTENCE] Starting search for fiscal code: ${fiscalCode}`);

    try {
      logger.info(
        `[PERSISTENCE] Querying subjectDataResponsesTable for fiscalCode: ${fiscalCode}`
      );
      const subjectResponseResult = await client
        .select()
        .from(subjectDataResponsesTable)
        .where(eq(subjectDataResponsesTable.subjectId, fiscalCode))
        .orderBy(desc(subjectDataResponsesTable.dataFrom))
        .limit(1);

      logger.info(
        `[PERSISTENCE] Query result from subjectDataResponsesTable: ${JSON.stringify(
          subjectResponseResult
        )}`
      );

      if (subjectResponseResult.length === 0) {
        logger.info(
          `[PERSISTENCE] No data response found for fiscal code: ${fiscalCode}. Returning null.`
        );
        return null;
      }

      const subjectDataResponseRow = subjectResponseResult[0];
      const subjectDataResponseId = subjectDataResponseRow.id;
      logger.info(
        `[PERSISTENCE] Found subjectDataResponse with ID: ${subjectDataResponseId} for fiscalCode: ${fiscalCode}`
      );

      logger.info(
        `[PERSISTENCE] Querying digitalAddressesTable for subjectDataResponseId: ${subjectDataResponseId}`
      );
      const digitalAddressesResult = await client
        .select()
        .from(digitalAddressesTable)
        .where(
          eq(digitalAddressesTable.subjectDataResponseId, subjectDataResponseId)
        );

      logger.info(
        `[PERSISTENCE] Query result from digitalAddressesTable: ${JSON.stringify(
          digitalAddressesResult
        )}`
      );

      const digitalAddressModels: ElementDigitalAddressModel[] =
        digitalAddressesResult.map((da) => ({
          digitalAddress: da.address,
          profession: da.profession ?? "",
          information: {
            reason: da.usageReason,
            endDate: da.usageEndAt
              ? da.usageEndAt.toISOString()
              : "9999-12-31T23:59:59.000Z",
          },
        }));
      logger.info(
        `[PERSISTENCE] Mapped ${digitalAddressModels.length} digital addresses.`
      );

      const finalResult: ResponseRequestDigitalAddressModel = {
        idSubject: subjectDataResponseRow.subjectId,
        from: subjectDataResponseRow.dataFrom.toISOString(),
        digitalAddress: digitalAddressModels,
      };
      logger.info(
        `[PERSISTENCE] Final data prepared for fiscal code ${fiscalCode}: ${JSON.stringify(
          finalResult
        )}`
      );

      return finalResult;
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Error during findSingleDataPreparationByFiscalCode for fiscal code '${fiscalCode}'.`,
        error
      );
      throw error;
    } finally {
      logger.info(
        `[PERSISTENCE] Finished executing findSingleDataPreparationByFiscalCode for fiscal code: ${fiscalCode}`
      );
    }
  }

  public async deleteAllDataPreparation(): Promise<number> {
    try {
      const result = await client.delete(dataPreparationTable);
      return result.rowCount ?? 0;
    } catch (error) {
      logger.error(
        `[PERSISTENCE] Error during deleteAllDataPreparation.`,
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
        `[PERSISTENCE] Error during deleteSingleDataPreparationByFiscalCode for fiscal code '${fiscalCode}'.`,
        error
      );
      throw error;
    }
  }
}
