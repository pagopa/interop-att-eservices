import { PgTable } from "drizzle-orm/pg-core";
import { SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

type SelectModel<T extends PgTable> = T["_"]["inferSelect"];
type InsertModel<T extends PgTable> = T["_"]["inferInsert"];

export class BaseRepository {
  public async find<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<SelectModel<T>[]> {
    const database = tx ?? db;
    return database.select().from(table).where(where) as Promise<
      SelectModel<T>[]
    >;
  }

  public async findOne<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<SelectModel<T> | undefined> {
    const database = tx ?? db;
    const results = await database.select().from(table).where(where).limit(1);
    return results[0] as SelectModel<T> | undefined;
  }

  public async create<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    data: InsertModel<T>,
    tx?: any
  ): Promise<SelectModel<T>> {
    const database = tx ?? db;
    const result = await database.insert(table).values(data).returning();
    return result[0] as SelectModel<T>;
  }

  public async createMany<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    data: InsertModel<T>[],
    tx?: any
  ): Promise<SelectModel<T>[]> {
    const database = tx ?? db;
    const result = await database.insert(table).values(data).returning();
    return result as SelectModel<T>[];
  }

  public async delete<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<number> {
    const database = tx ?? db;
    const result = await database.delete(table).where(where);
    return result.rowCount;
  }

  public async findOrCreate<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    createData: InsertModel<T>,
    tx?: any
  ): Promise<SelectModel<T>> {
    const record = await this.findOne(db, table, where, tx ?? db);
    if (record) {
      return record;
    }
    return this.create(db, table, createData, tx ?? db);
  }
}
