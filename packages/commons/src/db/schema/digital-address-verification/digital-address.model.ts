import {
  bigserial,
  varchar,
  timestamp,
  check,
  index,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { customSchema } from "../schema.js";
import { subjectDataResponsesTable } from "./subjectDataResponses.model.js";

export const motivationTerminationEnum = customSchema.enum(
  "motivation_termination_enum",
  ["CESSAZIONE_UFFICIO", "CESSAZIONE_VOLONTARIA"]
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
    daSubjectDataResponseIdIdx: index("da_sdr_response_id_idx").on(
      table.subjectDataResponseId
    ),
    emailCheck: check(
      "email_check",
      sql`address ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9.-]+)+$'`
    ),
  })
);
