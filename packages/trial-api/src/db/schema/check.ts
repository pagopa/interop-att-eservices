import { varchar, integer, bigserial } from "drizzle-orm/pg-core";
import { Category } from "./category.js";
import { customSchema } from "./schema.js";

export const Check = customSchema.table("check", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  order: integer("order").notNull(),
  category_id: bigserial("category_id", { mode: "number" })
    .references(() => Category.id)
    .notNull(),
});
