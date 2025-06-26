import { User, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';

export class UserRepository extends SyncableRepository<User> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, user);
  }

  /**
   * Get a user by their username.
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    const result = await this.db.select().from(user).where(eq(user.username, username)).limit(1);
    return result.length > 0 ? result[0] : null;
  }
}
