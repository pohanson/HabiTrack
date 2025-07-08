import { Friend, friend } from '@/db/localSchema';
import { and, eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';

export class FriendRepository extends SyncableRepository<Friend> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, friend);
  }

  public getFriendship(userId: string, friendId: string) {
    return this.db
      .select()
      .from(friend)
      .where(
        and(
          or(eq(friend.user_id, userId), eq(friend.friend_id, userId)),
          or(eq(friend.friend_id, friendId), eq(friend.user_id, friendId)),
        ),
      )
      .limit(1)
      .then((result) => result[0] || null);
  }

  public addFriend(userId: string, friendId: string) {
    super.create({ status: 'PENDING', user_id: userId, friend_id: friendId, isDeleted: false });
  }

  /**
   * Get all friends for a user as a query.
   * @param userId - The ID of the user whose friends to retrieve.
   * @param status - The status of the friendship to filter by. One of 'PENDING', 'ACCEPTED', 'REJECTED', or null for all statuses.
   */
  public getFriendsByUserIdQuery(
    userId: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null = 'ACCEPTED',
    includeDeleted: boolean = false,
  ) {
    return this.db
      .select()
      .from(friend)
      .where(
        and(
          or(eq(friend.user_id, userId), eq(friend.friend_id, userId)),
          status ? eq(friend.status, status) : undefined,
          includeDeleted ? undefined : eq(friend.isDeleted, includeDeleted),
        ),
      );
  }
}
