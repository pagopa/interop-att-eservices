import { NodePgDatabase, NodePgTransaction } from "drizzle-orm/node-postgres";

export type DBClient =
  | NodePgDatabase<Record<string, never>>
  | NodePgTransaction<Record<string, never>, Record<string, never>>;
