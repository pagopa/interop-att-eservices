import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Criteria } from "../db/schema/family-status/criteria.js";

export const InsertCriteriaSchema = createInsertSchema(Criteria);
export const SelectCriteriaSchema = createSelectSchema(Criteria);
