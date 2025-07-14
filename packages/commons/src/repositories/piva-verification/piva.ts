import { eq } from "drizzle-orm";
import { pivaTable } from "../../db/schema/piva-verification/piva.model.js";
import { DBClient } from "../../types/db.js";

export class PivaRepository {
  async setPivaObject(db: DBClient, organizationId: string): Promise<string> {
    await db.insert(pivaTable).values({ organizationId }).onConflictDoUpdate({
      target: pivaTable.organizationId,
      set: { organizationId },
    });
    return organizationId;
  }

  async getPivaObjectByKey(
    db: DBClient,
    organizationId: string,
  ): Promise<string | null> {
    const result = await db
      .select()
      .from(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId))
      .limit(1);

    if (result.length > 0) {
      return result[0].organizationId;
    }
    return null;
  }

  async deletePivaObjectByKey(
    db: DBClient,
    organizationId: string,
  ): Promise<void> {
    await db
      .delete(pivaTable)
      .where(eq(pivaTable.organizationId, organizationId));
  }
}
