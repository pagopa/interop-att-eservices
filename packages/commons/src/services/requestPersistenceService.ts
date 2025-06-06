// NOME FILE: persistenceService.ts

import { logger } from "pdnd-common";
import { ResponseRequestDigitalAddressModel } from "pdnd-models";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { BaseRepository } from "../db/postgres/base-repository.js";
import { client } from "../db/postgres/client.js";
import {
  listRequestsTable,
  requestSubjectsTable,
} from "../db/schema/digital-address.model.js";

export class PersistenceService {
  private readonly baseRepository: BaseRepository;

  constructor() {
    this.baseRepository = new BaseRepository();
  }

  public async saveDigitalAddressList(
    models: ResponseRequestDigitalAddressModel[],
    purposeId: string
  ): Promise<string | null> {
    try {
      await this.deleteAllDigitalAddressesByPurpose(purposeId);

      if (!models || models.length === 0) {
        return null;
      }

      const [listRequest] = await this.baseRepository.createMany(
        client,
        listRequestsTable,
        [
          {
            purposeId: purposeId,
            submittedRequestId: uuidv4(),
            status: "PRESA_IN_CARICO",
            createdAt: new Date(),
          },
        ]
      );

      const subjectsToInsert = models.map((model) => ({
        listRequestId: listRequest.id,
        subjectId: model.fiscalCode as string,
      }));

      await this.baseRepository.createMany(
        client,
        requestSubjectsTable,
        subjectsToInsert
      );

      logger.info(
        `PersistenceService: Lista per purposeId ${purposeId} salvata su DB.`
      );
      return listRequest.id;
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante il salvataggio su DB.`,
        error
      );
      throw error;
    }
  }

  public async findAllDigitalAddressesByPurpose(
    purposeId: string
  ): Promise<ResponseRequestDigitalAddressModel[] | null> {
    try {
      const listRequest = await this.baseRepository.findOne(
        client,
        listRequestsTable,
        eq(listRequestsTable.purposeId, purposeId)
      );

      if (!listRequest) return null;

      const subjects = await this.baseRepository.find(
        client,
        requestSubjectsTable,
        eq(requestSubjectsTable.listRequestId, listRequest.id)
      );

      return subjects.map((subject) => ({
        fiscalCode: subject.subjectId,
      })) as unknown as ResponseRequestDigitalAddressModel[];
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante findAllByKey da DB.`,
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

      if (result.length === 0) return null;

      return {
        fiscalCode: result[0].subjectId,
      } as unknown as ResponseRequestDigitalAddressModel;
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante findByPurposeId da DB.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllDigitalAddressesByPurpose(
    purposeId: string
  ): Promise<number | null> {
    try {
      const deletedCount = await this.baseRepository.delete(
        client,
        listRequestsTable,
        eq(listRequestsTable.purposeId, purposeId)
      );
      return deletedCount;
    } catch (error) {
      logger.error(
        `PersistenceService: Errore durante deleteAllByKey da DB.`,
        error
      );
      throw error;
    }
  }
}
