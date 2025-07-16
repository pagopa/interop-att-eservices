import { eq } from "drizzle-orm";
import { pivaTable } from "../../db/schema/piva-verification/piva.model.js";
import { Richiesta } from "../../db/model/pivaModel.js";
import { client } from "../../db/postgres/client.js";

export class PivaRepository {
  public async setPivaObject(organizationId: string): Promise<string> {
    await client
      .insert(pivaTable)
      .values({ organizationId })
      .onConflictDoUpdate({
        target: pivaTable.organizationId,
        set: { organizationId },
      });
    return organizationId;
  }

  public async getPivaObjectByKey(
    organizationId: string
  ): Promise<string | null> {
    const result = await client
      .select()
      .from(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId))
      .limit(1);

    if (result.length > 0) {
      return result[0].organizationId;
    }
    return null;
  }

  public async getAllPivaObject(): Promise<Richiesta[] | null> {
    return await client.select().from(pivaTable);
  }

  public async deletePivaObjectByKey(organizationId: string): Promise<void> {
    await client
      .delete(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId));
  }

  public async deleteAllPivaObject(): Promise<void> {
    await client.delete(pivaTable);
  }
}
