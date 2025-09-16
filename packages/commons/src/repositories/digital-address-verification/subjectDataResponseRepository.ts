import { ResponseRequestDigitalAddressModel } from "pdnd-models";

import { subjectDataResponsesTable } from "../../db/schema/digital-address-verification/subjectDataResponses.model.js";
import { client, logger } from "../../index.js";

export const SubjectDataResponseRepository = {
  async upsert(
    listRequestId: string,
    item: ResponseRequestDigitalAddressModel
  ): Promise<number> {
    try {
      const insertData = {
        listRequestId,
        subjectId: item.idSubject,
        dataFrom: new Date(item.from),
        createdAt: new Date(),
      };
      const [sdrUpsertResult] = await client
        .insert(subjectDataResponsesTable)
        .values(insertData)
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
      return sdrUpsertResult.id;
    } catch (error: unknown) {
      logger.error(
        `[SubjectDataResponseRepo] Error upserting subject data response for ${item.idSubject}.`,
        error
      );
      throw error;
    }
  },
};
