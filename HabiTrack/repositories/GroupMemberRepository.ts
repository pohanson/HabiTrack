import { groupMember, GroupMember } from '@/db/localSchema';
import { SyncableRepository } from './SyncableRepository';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq, and } from 'drizzle-orm';

export class GroupMemberRepository extends SyncableRepository<GroupMember> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, groupMember);
  }

  /**
   * Get all members of a group as a query by group ID
   * @param groupId
   * @param includeDeleted
   */
  public getMembersByGroupIdQuery(groupId: string, includeDeleted: boolean = false) {
    return this.db
      .select({ groupMember: groupMember })
      .from(groupMember)
      .where(
        and(
          eq(groupMember.group_id, groupId),
          includeDeleted ? undefined : eq(groupMember.isDeleted, false),
        ),
      );
  }

  public async deleteByGroupIdAndUserId(groupId: string, userId: string) {
    return this.db
      .update(groupMember)
      .set({ isDeleted: true })
      .where(
        and(
          eq(groupMember.group_id, groupId),
          eq(groupMember.user_id, userId),
          eq(groupMember.isDeleted, false),
        ),
      );
  }
}
