import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { CompleteSubjectBinding } from "../../db/schema/family-status/subject-binding.js";

export const InsertBindingSchema = createInsertSchema(
  CompleteSubjectBinding
).omit({
  id: true,
});

export const SelectBindingSchema = createSelectSchema(CompleteSubjectBinding);
export const UpdateBindingSchema = InsertBindingSchema.partial().extend({
  subjectId: z.string(),
});
