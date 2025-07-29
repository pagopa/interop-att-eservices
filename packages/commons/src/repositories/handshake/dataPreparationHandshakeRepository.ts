import { client, logger } from "pdnd-common";
import { HandshakeModel } from "pdnd-models";
import { eq } from "drizzle-orm";
import { handshakes } from "../../db/index.js";

export const dataPreparationHandshakeRepository = {
  async saveList(genericRequest: HandshakeModel[]): Promise<void> {
    if (!genericRequest || genericRequest.length === 0) {
      return;
    }
    try {
      const valuesToInsert = genericRequest.map((item) => ({
        apikey: item.apikey,
        cert: item.cert,
      }));

      await client
        .insert(handshakes)
        .values(valuesToInsert)
        .onConflictDoUpdate({
          target: handshakes.apikey,
          set: {
            cert: genericRequest[0].cert,
          },
        });

      logger.info(
        `dataPreparationRepository: ${valuesToInsert.length} item(s) successfully saved or updated.`
      );
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Error during item saving: `,
        error
      );
      throw error;
    }
  },

  async findAllByKey(): Promise<HandshakeModel[] | null> {
    try {
      const dataSaved = await client.select().from(handshakes);
      logger.info(
        `dataPreparationRepository: ${dataSaved.length} item(s) successfully retrieved.`
      );
      return dataSaved as HandshakeModel[];
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Error during item retrieval: `,
        error
      );
      throw error;
    }
  },

  async findByApikey(apikey: string): Promise<HandshakeModel | null> {
    try {
      logger.info(`Searching for apikey: ${apikey}`);
      const result = await client
        .select()
        .from(handshakes)
        .where(eq(handshakes.apikey, apikey))
        .limit(1);

      if (result.length > 0) {
        logger.info(
          `dataPreparationRepository: Item successfully retrieved for apikey ${apikey}.`
        );
        return result[0] as HandshakeModel;
      }

      logger.info(
        `dataPreparationRepository: No item found for apikey ${apikey}.`
      );
      return null;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Error during item retrieval for apikey ${apikey}:`,
        error
      );
      throw error;
    }
  },

  async deleteAllByKey(): Promise<number | null> {
    try {
      await client.delete(handshakes);
      logger.info(`dataPreparationRepository: All items successfully deleted.`);
      return 0;
    } catch (error) {
      logger.error(
        `dataPreparationRepository: Error during item deletion: `,
        error
      );
      throw error;
    }
  },
};
