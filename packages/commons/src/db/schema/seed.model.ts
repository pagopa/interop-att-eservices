import { text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { customSchema } from "./schema.js";

export const Seed = customSchema.table("seed", {
  idSeed: text("idSeed").primaryKey(),
  eServiceId: text("eServiceId").notNull(),
  algorithm: text("algorithmSpec").notNull(),
});
export type Seed = InferSelectModel<typeof Seed>;
