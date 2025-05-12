import { pgTable, serial, varchar, integer, bigint } from "drizzle-orm/pg-core";
import { Category } from "./category.js";

export const Check = pgTable("check", {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    order: integer("order").notNull(),
    category_id: bigint('category_id: ', { mode: 'number' }).references(() => Category.id)
});
