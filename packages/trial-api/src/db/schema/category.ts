import { varchar, integer, bigserial } from "drizzle-orm/pg-core";
import { customSchema } from "./schema.js";

export const Category = customSchema.table("category", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 255 }).notNull(),
  eservice: varchar("eservice", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  order: integer("order").notNull(),
});
