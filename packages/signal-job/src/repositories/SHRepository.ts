import { client } from "pdnd-common";
import { signalCounters } from "pdnd-common";
import { sql } from "drizzle-orm";

export const SHRepository = {
  async getAllEserviceIds(): Promise<string[]> {
    const rows = await client
      .select({ eserviceId: signalCounters.eserviceId })
      .from(signalCounters)
      .execute();
    return rows.map((row) => row.eserviceId);
  },

  async ensureAndIncrementSignalId(eserviceId: string): Promise<number> {
    const results = await client
      .insert(signalCounters)
      .values({ eserviceId, signalId: 1 })
      .onConflictDoUpdate({
        target: signalCounters.eserviceId,
        set: { signalId: sql`${signalCounters.signalId} + 1` },
      })
      .returning({ newId: signalCounters.signalId })
      .execute();

    if (!results || results.length === 0) {
      throw new Error(`Failed to increment signalId for ${eserviceId}`);
    }
    return results[0].newId;
  },
};
