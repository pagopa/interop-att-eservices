import { uuid } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { customSchema } from "./schema.js";

export const Purpose = customSchema.table("purposes", {
  id: uuid("id").primaryKey(),
});
export type Purpose = InferSelectModel<typeof Purpose>;
