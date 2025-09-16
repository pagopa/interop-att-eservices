import { eq } from "drizzle-orm";
import { PartitaIvaModel } from "pdnd-models";
import { pivaTable } from "../../db/schema/piva-verification/piva.model.js";
import { PivaRequest } from "../../db/model/pivaModel.js";
import { client } from "../../db/postgres/client.js";

export const PivaRepository = {
  async setPivaObject(organizationId: string): Promise<string> {
    await client
      .insert(pivaTable)
      .values({ organizationId })
      .onConflictDoUpdate({
        target: pivaTable.organizationId,
        set: { organizationId },
      });
    return organizationId;
  },

  async getPivaObjectByKey(
    organizationId: string
  ): Promise<PartitaIvaModel | null> {
    const result = await client
      .select()
      .from(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId))
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }
    return null;
  },

  async getAllPivaObject(): Promise<PivaRequest[] | null> {
    return await client.select().from(pivaTable);
  },

  async deletePivaObjectByKey(organizationId: string): Promise<void> {
    await client
      .delete(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId));
  },

  async deleteAllPivaObject(): Promise<void> {
    await client.delete(pivaTable);
  },
};
