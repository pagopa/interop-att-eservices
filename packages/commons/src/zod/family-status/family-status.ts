import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { familyStatus } from "../../db/schema/family-status/family-status.js";

export const insertFamilyStatusSchema = createInsertSchema(familyStatus);
export const selectFamilyStatusSchema = createSelectSchema(familyStatus);

export type InsertFamilyStatus = typeof insertFamilyStatusSchema._type;
export type SelectFamilyStatus = typeof selectFamilyStatusSchema._type;
