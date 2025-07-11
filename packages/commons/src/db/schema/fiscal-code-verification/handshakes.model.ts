import { serial, text, timestamp } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const handshakes = customSchema.table("handshakes", {
  id: serial("id").primaryKey(),

  purposeId: text("purpose_id").notNull().unique(),

  certificate: text("certificate").notNull(),

  contextKey: text("context_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
