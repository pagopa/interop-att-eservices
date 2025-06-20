import { text, timestamp } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const dataPreparationTable = customSchema.table("data_preparation", {
  idSubject: text("id_subject").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
