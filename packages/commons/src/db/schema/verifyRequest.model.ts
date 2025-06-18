import { pgSchema, uuid, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
export const customSchema = pgSchema("att");
export const verificationRequestsTable = customSchema.table(
  "verification_requests",
  {
    idRequest: uuid("id").primaryKey(),
    count: integer("count").notNull(),
    jsonRequest: jsonb("json_request").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);
