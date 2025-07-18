import { varchar, integer, bigserial } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { Category } from "./index.js";

export const Check = customSchema.table("check", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  order: integer("order").notNull(),
  category_id: bigserial("category_id", { mode: "number" })
    .references(() => Category.id)
    .notNull(),
});
