import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { Subject } from "./subjects.model.js";
import { Purpose } from "./purposes.model.js";
import { Address } from "./addresses.model.js";
const att = pgSchema("att");

export const Usecase = att.table("usecases", {
  id: uuid("id").primaryKey().defaultRandom(),

  purpose_id: uuid("purpose_id")
    .notNull()
    .references(() => Purpose.id),
  subject_id: uuid("subject_id")
    .notNull()
    .references(() => Subject.uuid),
  address_id: uuid("address_id")
    .notNull()
    .references(() => Address.id),
});

export type Usecase = InferSelectModel<typeof Usecase>;
