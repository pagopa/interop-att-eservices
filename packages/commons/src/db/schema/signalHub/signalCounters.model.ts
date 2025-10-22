import { text, bigint } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
export const signalCounters = customSchema.table("signal_counters", {
  eserviceId: text("eservice_id").primaryKey(),
  signalId: bigint("signal_id", { mode: "number" }).notNull().default(0),
});
