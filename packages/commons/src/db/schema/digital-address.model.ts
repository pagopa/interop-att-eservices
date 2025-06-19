import {
  bigserial,
  varchar,
  timestamp,
  // eslint-disable-next-line id-blacklist
  boolean,
  uuid,
  check,
  index,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { customSchema } from "./schema.js";
import { Purpose } from "./purpose.model.js";

export const motivationTerminationEnum = customSchema.enum(
  "motivation_termination_enum",
  ["CESSAZIONE_UFFICIO", "CESSAZIONE_VOLONTARIA"]
);

export const statusProcessingRequestEnum = customSchema.enum(
  "status_processing_request_enum",
  ["PRESA_IN_CARICO", "IN_ELABORAZIONE", "DISPONIBILE"]
);

export const listRequestsTable = customSchema.table(
  "list_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    purposeId: uuid("purpose_id")
      .notNull()
      .references(() => Purpose.id, { onDelete: "cascade" }),
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
    submittedReqIdIdx: index("lr_submitted_req_id_idx").on(
      table.submittedRequestId
    ),
    purposeIdIdx: index("lr_purpose_id_idx").on(table.purposeId),
  })
);

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
    listReqFkIdx: index("sdr_list_request_fk_idx").on(table.listRequestId),
    idSubjectIdx: index("sdr_subject_id_idx").on(table.subjectId),
    idSubjectCheck: check(
      "id_subject_check",
      sql`subject_id ~ '^([0-9]{11})|([A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1})$'`
    ),
  })
);

export const digitalAddressesTable = customSchema.table(
  "digital_addresses",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    subjectDataResponseId: bigint("subject_data_response_id", {
      mode: "number",
    })
      .notNull()
      .references(() => subjectDataResponsesTable.id, { onDelete: "cascade" }),
    address: varchar("address", { length: 255 }).notNull(),
    profession: varchar("profession", { length: 255 }),
    usageReason: motivationTerminationEnum("usage_reason").notNull(),
    usageEndAt: timestamp("usage_end_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    sdrFkIdx: index("da_sdr_fk_idx").on(table.subjectDataResponseId),
    emailCheck: check(
      "email_check",
      sql`address ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9.-]+)+$'`
    ),
  })
);

export const verificationLogsTable = customSchema.table("verification_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  result: boolean("result").notNull(),
  checkedAt: timestamp("checked_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
