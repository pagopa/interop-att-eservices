import { varchar, timestamp, uuid, index } from "drizzle-orm/pg-core";

import { customSchema } from "../schema.js";

export const statusProcessingRequestEnum = customSchema.enum(
  "status_processing_request_enum",
  ["PRESA_IN_CARICO", "IN_ELABORAZIONE", "DISPONIBILE"]
);

export const listRequestsTable = customSchema.table(
  "list_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submittedRequestId: varchar("submitted_request_id", { length: 255 })
      .unique()
      .notNull(),
    status: statusProcessingRequestEnum("status").notNull(),
    statusMessage: varchar("status_message", { length: 1024 }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    submittedReqIdIdx: index("lr_submitted_req_id_idx_list_requests").on(
      table.submittedRequestId
    ),
  })
);
