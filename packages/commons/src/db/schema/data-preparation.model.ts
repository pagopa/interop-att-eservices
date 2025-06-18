import { pgSchema, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const customSchema = pgSchema("att");

export const dataPreparationTable = customSchema.table("data_preparation", {
  idSubject: text("id_subject").primaryKey(), // Fiscal code as the unique identifier
  data: jsonb("data").notNull(), // Stores the ResponseRequestDigitalAddressModel
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
