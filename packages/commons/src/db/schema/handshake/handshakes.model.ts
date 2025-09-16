import { text } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const handshakes = customSchema.table("handshakes", {
  apikey: text("apikey").notNull().primaryKey(),
  cert: text("context_key").notNull(),
});
