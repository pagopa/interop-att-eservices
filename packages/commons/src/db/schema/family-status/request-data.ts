import { json, text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";

export const RequestData = customSchema.table("request_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestType: text("request_type"),
  requestedBy: text("requested_by"),
  createdAt: text("created_at"),
  additionalInfo: json("additional_info"),
});
