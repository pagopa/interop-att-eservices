// src/utility/validateInsert.ts
import { z } from "zod";
import { DBClient } from "../types/db.js";

export async function validateAndInsert<T>(
  label: string,
  data: T,
  insertFn: (data: T, db: DBClient) => Promise<T>,
  db: DBClient,
  schema?: z.ZodSchema<T>
): Promise<T> {
  try {
    if (schema) {
      schema.parse(data);
    }
    const result = await insertFn(data, db);
    if (result === undefined) {
      throw new Error(`Insert fn for ${label} returned undefined`);
    }
    return result;
  } catch (err) {
    throw new Error(`Insert failed for ${label}: ${(err as Error).message}`);
  }
}
