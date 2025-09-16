import { varchar, uuid, primaryKey } from "drizzle-orm/pg-core";
import { customSchema } from "../schema.js";
import { listRequestsTable } from "./listRequest.model.js";

export const requestSubjectsTable = customSchema.table(
  "request_subjects",
  {
    listRequestId: uuid("list_request_id")
      .notNull()
      .references(() => listRequestsTable.id, { onDelete: "cascade" }),
    subjectId: varchar("subject_id", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.listRequestId, table.subjectId] }),
  })
);
