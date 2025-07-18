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

    // Assuming the check_id can fit within a JS number range, convert it to number
    const checkIdAsNumber = Number(check_id); // Convert BigInt to number (if safe)

    // Alternatively, if the value is too large, you can convert it to a string:
    // const checkIdAsString = check_id.toString(); // Use this if you're unsure about number range

    await client.insert(Trial).values({
      purpose_id: "unknown",
      correlation_id: "not_set",
      operation_path: operationPath,
      operation_method: operationMethod,
      check_id: checkIdAsNumber, // Pass the converted value
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
