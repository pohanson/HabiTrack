import { SyncableModel } from '@/types/SyncableModel';
import { eq, gte, lte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';
import { SQLiteRunResult } from 'expo-sqlite';

export type PartialSync<TModel> = Omit<TModel, keyof SyncableModel> & Partial<SyncableModel>;
/**
 * Abstract class for repositories that handle syncable models.
 *
 * Provides basic CRUD operations and ID generation.
 */
export abstract class SyncableRepository<TModel extends SyncableModel> {
  protected db: ReturnType<typeof drizzle>;
  protected table: SQLiteTableWithColumns<any>;

  constructor(db: ReturnType<typeof drizzle>, table: SQLiteTableWithColumns<any>) {
    this.db = db;
    this.table = table;
  }

  /**
   * Generates a unique 16 character ID based on the current timestamp and a random string.
   */
  public static generateId(): string {
    return new Date()
      .getTime()
      .toString(36) // 8 character long until 2059-4-26
      .concat(Math.random().toString(36).slice(2)) // ignores the first 2 characters '0.'
      .slice(0, 16);
  }

  /**
   * Creates a new item in the database
   * @param item - The item to insert. Syncable properties will be set if not included.
   */
  public async create(item: PartialSync<TModel>): Promise<TModel> {
    try {
      item.id = item.id || SyncableRepository.generateId();

      const now = new Date().toISOString();
      item.createdAt = item.createdAt || now;
      item.modifiedAt = now;

      const result = (await this.db
        .insert(this.table)
        .values(item as TModel)
        .returning()) as TModel[];
      return result[0] as TModel;
    } catch (error) {
      console.error('Error creating item:', error);
      throw new Error(
        `Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Creates many new items in the database
   * @param items - The items to insert. Syncable properties will be set if not included.
   */
  public async createMany(items: PartialSync<TModel>[]): Promise<TModel[]> {
    try {
      const now = new Date().toISOString();
      const itemsWithTimestamps = items.map((item) => ({
        ...item,
        id: item.id || SyncableRepository.generateId(),
        createdAt: item.createdAt || now,
        modifiedAt: now,
      })) as TModel[];
      return (await this.db.insert(this.table).values(itemsWithTimestamps).returning()) as TModel[];
    } catch (error) {
      console.error('Error creating multiple items:', error);
      throw new Error(
        `Failed to create items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Retrieves all items from the database.
   * @param includeDeleted - Whether to include soft deleted items. Defaults to false.
   */
  public async getAll(includeDeleted: boolean = false): Promise<TModel[]> {
    try {
      return (await this.getAllQuery(includeDeleted)) as TModel[];
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error(
        `Failed to fetch items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Similar to getAll, but returns a query that could be used with useLiveQuery
   */
  public getAllQuery(includeDeleted: boolean = false) {
    try {
      return this.db
        .select()
        .from(this.table)
        .where(includeDeleted ? undefined : eq(this.table.isDeleted, false));
    } catch (error) {
      console.error('Error fetching items query:', error);
      throw new Error(
        `Failed to fetch items query: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Retrieves an item by its id.
   * @returns A query that retrieves the item by its id.
   */
  public getByIdQuery(id: string) {
    try {
      return this.db.select().from(this.table).where(eq(this.table.id, id));
    } catch (error) {
      console.error('Error fetching item by ID query:', error);
      throw new Error(
        `Failed to fetch item by ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Retrieves an item by its id.
   * @returns The item if found, or null if not found.
   */
  public async getById(id: string): Promise<TModel | null> {
    try {
      const results = await this.getByIdQuery(id);
      return results.length > 0 ? (results[0] as TModel) : null;
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      throw new Error(
        `Failed to fetch item by ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
  /**
   * Updates an existing item in the database.
   * @param item - The item to update. **Must include the id property**.
   */
  public async update(item: Partial<TModel> & Pick<TModel, 'id'>): Promise<SQLiteRunResult> {
    try {
      if (!item.id) {
        throw new Error('Item must have an `id` to update. Received:\n' + JSON.stringify(item));
      }
      return this.db
        .update(this.table)
        .set({ ...item, modifiedAt: new Date().toISOString() })
        .where(eq(this.table.id, item.id))
        .execute();
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error(
        `Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
  /**
   * Soft deletes an item by marking it as deleted.
   */
  public async delete(id: string): Promise<SQLiteRunResult> {
    try {
      return this.db
        .update(this.table)
        .set({ isDeleted: true, modifiedAt: new Date().toISOString() })
        .where(eq(this.table.id, id))
        .execute();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error(
        `Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // syncing logic
  public async getModifiedAfter(lastSyncTimestamp: string): Promise<TModel[]> {
    try {
      return (await this.db
        .select()
        .from(this.table)
        .where(gte(this.table.modifiedAt, lastSyncTimestamp))) as TModel[];
    } catch (error) {
      console.error('Error fetching modified items:', error);
      throw new Error(
        `Failed to fetch modified items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  public async updateModifiedItems(items: TModel[]) {
    this.db.transaction(async (tx) => {
      items.forEach((item) =>
        tx
          .insert(this.table)
          .values(item)
          .onConflictDoUpdate({
            target: this.table.id,
            set: {
              ...item,
            },
            // Only update newer items
            where: lte(this.table.modifiedAt, item.modifiedAt),
          })
          .execute(),
      );
    });
  }
}
