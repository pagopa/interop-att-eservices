import {
  bigserial,
  varchar,
  timestamp,
  uuid,
  check,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { customSchema } from "../schema.js";
import { listRequestsTable } from "./listRequest.model.js";

export const subjectDataResponsesTable = customSchema.table(
  "subject_data_responses",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    listRequestId: uuid("list_request_id")
      .notNull()
      .references(() => listRequestsTable.id, { onDelete: "cascade" }),
    subjectId: varchar("subject_id", { length: 255 }).notNull(),
    dataFrom: timestamp("data_from", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    listReqFkIdx: index("sdr_list_request_fk_idx_sdr").on(table.listRequestId),
    idSubjectIdx: index("sdr_subject_id_idx_sdr").on(table.subjectId),
    idSubjectCheck: check(
      "id_subject_check",
      sql`subject_id ~ '^([0-9]{11})|([A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1})$'`
    ),

    uniqueListRequestSubject: unique("unique_sdr_list_req_subject").on(
      table.listRequestId,
      table.subjectId
    ),
  })
);
