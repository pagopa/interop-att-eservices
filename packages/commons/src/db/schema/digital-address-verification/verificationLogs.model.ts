// eslint-disable-next-line id-blacklist
import { bigserial, boolean, timestamp } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const verificationLogsTable = customSchema.table("verification_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  result: boolean("result").notNull(),
  checkedAt: timestamp("checked_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
