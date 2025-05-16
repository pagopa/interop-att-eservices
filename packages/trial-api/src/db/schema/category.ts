import { varchar, integer, bigserial, pgSchema } from "drizzle-orm/pg-core";

export const customSchema = pgSchema('att');

export const Category = customSchema.table('category', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    code: varchar('code', { length: 255 }).notNull(),
    eservice: varchar('eservice', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    order: integer('order').notNull()
});