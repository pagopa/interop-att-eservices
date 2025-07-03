import { z } from "zod";
import { DBClient } from "../types/db.js";

type InsertFn<T> = (data: T, db: DBClient) => Promise<T>;

export async function validateAndInsert<T>(
  label: string,
  data: T,
  insertFn: InsertFn<T>,
  db: DBClient,
  schema?: z.ZodSchema<T>
): Promise<T> {
  try {
    if (schema) {
      schema.parse(data);
    }

    const result = await insertFn(data, db);

    if (result === undefined) {
      throw new Error(`Insert function for ${label} returned undefined`);
    }

    return result;
  } catch (err) {
    throw new Error(`Insert failed for ${label}: ${(err as Error).message}`);
  }
}
