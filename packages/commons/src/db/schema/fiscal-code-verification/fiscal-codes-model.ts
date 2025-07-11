import { serial, text, timestamp } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
export const fiscalCodes = customSchema.table("fiscal_codes", {
  id: serial("id").primaryKey(),
  fiscalCode: text("fiscal_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
