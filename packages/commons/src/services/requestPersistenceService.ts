import { logger } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { client } from "../db/postgres/client.js";
import {
  listRequestsTable,
  requestSubjectsTable,
  subjectDataResponsesTable,
  digitalAddressesTable,
} from "../db/schema/digital-address.model.js";

export class PersistenceService {
  private async saveListInternal(
    models: ResponseRequestDigitalAddressModel[],
    purposeId: string
  ): Promise<string | null> {
    const validModels = models.filter(
      (model) => model.idSubject && model.idSubject.trim() !== ""
    );

    if (!validModels || validModels.length === 0) {
      logger.warn("Nessun modello valido da salvare dopo il filtraggio.");
      return null;
    }

    return await client.transaction(async (tx) => {
      const [listRequest] = await tx
        .insert(listRequestsTable)
        .values({
          purposeId: purposeId,
          submittedRequestId: uuidv4(),
          status: "PRESA_IN_CARICO",
          createdAt: new Date(),
        })
        .returning({ listRequestId: listRequestsTable.id });

      if (!listRequest) {
        throw new Error("Creazione della listRequest fallita.");
      }

      const listRequestId = listRequest.listRequestId;

      const subjectsToInsert = validModels.map((model) => ({
        listRequestId: listRequestId,
        subjectId: model.idSubject,
      }));
      if (subjectsToInsert.length > 0) {
        await tx.insert(requestSubjectsTable).values(subjectsToInsert);
      }

      for (const model of validModels) {
        const [subjectDataResponse] = await tx
          .insert(subjectDataResponsesTable)
          .values({
            listRequestId: listRequestId,
            subjectId: model.idSubject,
            dataFrom: new Date(model.from),
          })
          .returning({ responseId: subjectDataResponsesTable.id });

        if (!subjectDataResponse) {
          throw new Error(
            `Creazione di subjectDataResponse per ${model.idSubject} fallita.`
          );
        }

        if (model.digitalAddress && model.digitalAddress.length > 0) {
          const addressesToInsert = model.digitalAddress.map((addr) => ({
            subjectDataResponseId: subjectDataResponse.responseId,
            address: addr.digitalAddress,
            profession: addr.profession,
            usageReason: addr.information.reason,
            usageEndAt: new Date(addr.information.endDate),
          }));
          await tx.insert(digitalAddressesTable).values(addressesToInsert);
        }
      }

      logger.info(
        `PersistenceService: Lista per purposeId ${purposeId} salvata correttamente.`
      );
      return listRequestId;
    });
  }

  public async saveDataPreparationList(
    models: ResponseRequestDigitalAddressModel[],
    purposeId: string
  ): Promise<string | null> {
    try {
      return await this.saveListInternal(models, purposeId);
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante saveDataPreparationList.`,
        error
      );
      throw error;
    }
  }

  public async saveDigitalAddressList(
    models: ResponseRequestDigitalAddressModel[],
    purposeId: string
  ): Promise<string | null> {
    try {
      return await this.saveListInternal(models, purposeId);
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante saveDigitalAddressList.`,
        error
      );
      throw error;
    }
  }

  public async findAllDataPreparationByPurpose(
    purposeId: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    return this.findAllDigitalAddressesByPurpose(purposeId);
  }

  public async findSingleDataPreparationByFiscalCode(
    purposeId: string,
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    return this.findSingleDigitalAddressByPurpose(purposeId, fiscalCode);
  }

  public async deleteAllDataPreparationByPurpose(
    purposeId: string
  ): Promise<number> {
    return this.deleteAllDigitalAddressesByPurpose(purposeId);
  }

  public async findAllDigitalAddressesByPurpose(
    purposeId: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      const flatResults = await client
        .select({
          listRequestId: listRequestsTable.id,
          subjectId: requestSubjectsTable.subjectId,
          dataFrom: subjectDataResponsesTable.dataFrom,
          address: digitalAddressesTable.address,
          profession: digitalAddressesTable.profession,
          usageReason: digitalAddressesTable.usageReason,
          usageEndAt: digitalAddressesTable.usageEndAt,
        })
        .from(listRequestsTable)
        .leftJoin(
          requestSubjectsTable,
          eq(listRequestsTable.id, requestSubjectsTable.listRequestId)
        )
        .leftJoin(
          subjectDataResponsesTable,
          eq(listRequestsTable.id, subjectDataResponsesTable.listRequestId)
        )
        .leftJoin(
          digitalAddressesTable,
          eq(
            subjectDataResponsesTable.id,
            digitalAddressesTable.subjectDataResponseId
          )
        )
        .where(eq(listRequestsTable.purposeId, purposeId));

      if (!flatResults || flatResults.length === 0) {
        return null;
      }
      const groupedBySubject = new Map<
        string,
        ResponseRequestDigitalAddressModel
      >();

      for (const row of flatResults) {
        if (!row.subjectId) {
          continue;
        }
        if (!groupedBySubject.has(row.subjectId)) {
          groupedBySubject.set(row.subjectId, {
            idSubject: row.subjectId,
            from: row.dataFrom?.toISOString() ?? "",
            digitalAddress: [],
          });
        }

        const subjectModel = groupedBySubject.get(row.subjectId)!;

        if (row.address) {
          subjectModel.digitalAddress.push({
            digitalAddress: row.address,
            profession: row.profession ?? undefined,
            information: {
              reason: row.usageReason!,
              endDate: row.usageEndAt?.toISOString() ?? "",
            },
          });
        }
      }

      return Array.from(groupedBySubject.values());
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante findAllDigitalAddressesByPurpose.`,
        error
      );
      throw error;
    }
  }

  public async findSingleDigitalAddressByPurpose(
    purposeId: string,
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    try {
      const result = await client
        .select({ subjectId: requestSubjectsTable.subjectId })
        .from(requestSubjectsTable)
        .innerJoin(
          listRequestsTable,
          eq(requestSubjectsTable.listRequestId, listRequestsTable.id)
        )
        .where(
          and(
            eq(listRequestsTable.purposeId, purposeId),
            eq(requestSubjectsTable.subjectId, fiscalCode)
          )
        )
        .limit(1);

      return result.length > 0
        ? ({
            idSubject: result[0].subjectId,
          } as unknown as ResponseRequestDigitalAddressModel)
        : null;
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante findSingleDigitalAddressByPurpose.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllDigitalAddressesByPurpose(
    purposeId: string
  ): Promise<number> {
    try {
      const result = await client
        .delete(listRequestsTable)
        .where(eq(listRequestsTable.purposeId, purposeId))
        .returning();

      const deletedCount = result.length;
      logger.info(
        `PersistenceService: Cancellate ${deletedCount} liste per purposeId ${purposeId}.`
      );
      return deletedCount;
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante deleteAllDigitalAddressesByPurpose.`,
        error
      );
      throw error;
    }
  }
}
