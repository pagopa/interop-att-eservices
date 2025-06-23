import { createInsertSchema } from "drizzle-zod";
import { CompleteSubjectBinding } from "../db/schema/family-status/subject-binding.js";

export const InsertBindingSchema = createInsertSchema(
  CompleteSubjectBinding
).omit({
  id: true,
});
