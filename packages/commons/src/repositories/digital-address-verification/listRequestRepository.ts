/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from "uuid";

import { listRequestsTable } from "../../db/schema/digital-address-verification/listRequest.model.js";
import { requestSubjectsTable } from "../../db/schema/digital-address-verification/requestSubjects.model.js";
import { client, logger } from "../../index.js";



export const ListRequestRepository = {

   async createListRequest(): Promise<string> {
    try {
      const insertData = {
        id: uuidv4(),
        submittedRequestId: uuidv4(),
        status: "PRESA_IN_CARICO" as const,
        createdAt: new Date(),
      };
      const [insertedListRequest] = await client
        .insert(listRequestsTable)
        .values(insertData)
        .returning({ id: listRequestsTable.id });

      if (!insertedListRequest?.id) {
        throw new Error("Failed to insert main list request.");
      }
      return insertedListRequest.id;
    } catch (error: unknown) {
      logger.error(`[ListRequestRepo] Error creating list request.`, error);
      throw error;
    }
  },

   async addRequestSubject( listRequestId: string, subjectId: string): Promise<void> {
    try {
      const insertData = {
        listRequestId,
        subjectId,
      };
      await client
        .insert(requestSubjectsTable)
        .values(insertData)
        .onConflictDoNothing();
    } catch (error: unknown) {
      logger.error(`[ListRequestRepo] Error adding request subject ${subjectId} to list ${listRequestId}.`, error);
      throw error;
    }
  },
};