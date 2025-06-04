import { varchar, bigserial, bigint, timestamp } from "drizzle-orm/pg-core";
import { Check } from "./check.js";
import { customSchema } from "./schema.js";

export const Trial = customSchema.table('trial', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    purpose_id: varchar('purpose_id', { length: 255 }).notNull(),
    correlation_id: varchar('correlation_id', { length: 255 }).notNull(),
    operation_path: varchar('operation_path', { length: 255 }).notNull(),
    operation_method: varchar('operation_method', { length: 255 }),
    check_id: bigint('check_id', { mode: 'number' }).references(() => Check.id),
    response: varchar('response', { length: 255 }),
    created_date: timestamp('created_date'),
    message: varchar('message', { length: 255 }),
});
