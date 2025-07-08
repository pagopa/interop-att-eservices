import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { BirthDate } from "../db/schema/family-status/birth-date.js";

export const InsertBirthDateSchema = createInsertSchema(BirthDate);

export const SelectBirthDateSchema = createSelectSchema(BirthDate);
