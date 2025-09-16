import { eq } from "drizzle-orm";
import { client } from "../../db/postgres/client.js";
import { Trial } from "../../db/index.js";
import { getCheckValue } from "../../utility/index.js";

export const TrialRepository = {
  async insert(
    operationPath: string,
    operationMethod: string,
    checkName: string,
    response?: string,
    message?: string
  ): Promise<void> {
    const check_id = getCheckValue(checkName);
    if (!check_id) {
      throw new Error(`Unknown check name: ${checkName}`);
    }

    const checkIdAsNumber = Number(check_id);

    await client.insert(Trial).values({
      purpose_id: "unknown",
      correlation_id: "not_set",
      operation_path: operationPath,
      operation_method: operationMethod,
      check_id: checkIdAsNumber,
      response: response ?? null,
      created_date: new Date(),
      message: message ?? null,
    });
  },

  async findByCorrelationId(correlationId: string): Promise<unknown[]> {
    return client
      .select()
      .from(Trial)
      .where(eq(Trial.correlation_id, correlationId));
  },

  async existCorrelationId(correlationId: string): Promise<boolean> {
    const results = await this.findByCorrelationId(correlationId);
    return results.length > 0;
  },
};
