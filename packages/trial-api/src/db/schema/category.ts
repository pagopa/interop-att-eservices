import { pgTable, varchar, integer, bigserial, text } from "drizzle-orm/pg-core";

export const Category = pgTable("category", {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    eservice: varchar("eservice", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    order: integer("order").notNull(),
    name: text("name")
});