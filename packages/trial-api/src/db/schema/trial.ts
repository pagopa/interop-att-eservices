import { pgTable, serial, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
import { Check } from "./check.js";

export const Trial = pgTable("trial", {
    id: serial("id").primaryKey(),
    purpose_id: varchar("purpose_id", { length: 255 }).notNull(),
    correlation_id: varchar("correlation_id", { length: 255 }).notNull(),
    operation_path: varchar("operation_path", { length: 255 }).notNull(),
    operation_method: varchar("operation_method", { length: 255 }),
    check_id: bigint('check_id: ', { mode: 'number' }).references(() => Check.id),
    response: varchar("response", { length: 255 }),
    created_date: timestamp("created_date"),
    message: varchar("message", { length: 255 }),
});