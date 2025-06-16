import { PgTable } from "drizzle-orm/pg-core";
import { SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { logger } from "pdnd-common";

type SelectModel<T extends PgTable> = T["_"]["inferSelect"];
type InsertModel<T extends PgTable> = T["_"]["inferInsert"];

export class BaseRepository {
  private checkTable(table: any, methodName: string): void {
    if (!table || !table._ || !table._.name) {
      const errorMessage = `[FATAL] BaseRepository -'${methodName}' called with an invalid or undefined table object.`;
      logger.error(errorMessage);
      throw new TypeError(errorMessage);
    }
  }

  public async find<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<SelectModel<T>[]> {
    this.checkTable(table, "find");
    logger.info(`[START] BaseRepository - find on table ${table._.name}`);
    try {
      const database = tx ?? db;
      return database.select().from(table).where(where) as Promise<
        SelectModel<T>[]
      >;
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - find on table ${table._.name}:`,
        error
      );
      throw error;
    }
  }

  public async findOne<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<SelectModel<T> | undefined> {
    this.checkTable(table, "findOne");
    logger.info(`[START] BaseRepository - findOne on table ${table._.name}`);
    try {
      const database = tx ?? db;
      const results = await database.select().from(table).where(where).limit(1);
      return results[0] as SelectModel<T> | undefined;
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - findOne on table ${table._.name}:`,
        error
      );
      throw error;
    }
  }

  public async create<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    data: InsertModel<T>,
    tx?: any
  ): Promise<SelectModel<T>> {
    this.checkTable(table, "create");
    logger.info(`[START] BaseRepository - create on table ${table._.name}`);
    try {
      const database = tx ?? db;
      const result = await database.insert(table).values(data).returning();
      return result[0] as SelectModel<T>;
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - create on table ${table._.name}:`,
        error
      );
      throw error;
    }
  }

  public async createMany<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    data: InsertModel<T>[],
    tx?: any
  ): Promise<SelectModel<T>[]> {
    this.checkTable(table, "createMany");
    logger.info(`[START] BaseRepository - createMany on table ${table._.name}`);
    try {
      const database = tx ?? db;
      const result = await database.insert(table).values(data).returning();
      return result as SelectModel<T>[];
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - createMany on table ${table._.name}:`,
        error
      );
      throw new Error(`Errore create many: ${JSON.stringify(error)}`);
    }
  }

  public async delete<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    tx?: any
  ): Promise<number> {
    this.checkTable(table, "delete");
    logger.info(`[START] BaseRepository - delete on table ${table._.name}`);
    try {
      const database = tx ?? db;
      const result = await database.delete(table).where(where);
      return result.rowCount;
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - delete on table ${table._.name}:`,
        error
      );
      throw error;
    }
  }

  public async findOrCreate<T extends PgTable>(
    db: NodePgDatabase<any>,
    table: T,
    where: SQL,
    createData: InsertModel<T>,
    tx?: any
  ): Promise<SelectModel<T>> {
    this.checkTable(table, "findOrCreate");
    logger.info(
      `[START] BaseRepository - findOrCreate on table ${table._.name}`
    );
    try {
      const record = await this.findOne(db, table, where, tx ?? db);
      if (record) {
        return record;
      }
      return this.create(db, table, createData, tx ?? db);
    } catch (error) {
      logger.error(
        `[ERROR] BaseRepository - findOrCreate on table ${table._.name}:`,
        error
      );
      throw error;
    }
  }
}
