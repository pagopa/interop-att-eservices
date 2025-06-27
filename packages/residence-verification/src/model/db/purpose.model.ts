import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
const att = pgSchema("att");

export const Purpose = att.table("purposes", {
  id: uuid("id").primaryKey(),
});
export type Purpose = InferSelectModel<typeof Purpose>;
