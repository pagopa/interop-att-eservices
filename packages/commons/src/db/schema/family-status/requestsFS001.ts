import { text, uuid } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { Criteria } from "./criteria.js";
import { RequestData } from "./request-data.js";

export const RequestsFS001 = customSchema.table("requests_fs001", {
  id: uuid("id").defaultRandom().primaryKey(),
  operationId: text("operation_id").notNull(),
  criteriaId: uuid("criteria_id")
    .references(() => Criteria.id)
    .notNull(),
  requestDataId: uuid("request_data_id")
    .references(() => RequestData.id)
    .notNull(),
});
