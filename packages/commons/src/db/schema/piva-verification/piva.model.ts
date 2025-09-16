import { text } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const pivaTable = customSchema.table("piva", {
  organizationId: text("organization_id").primaryKey(),
});
