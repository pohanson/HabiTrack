import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';
import { group, Group, groupMember } from '@/db/localSchema';
import { eq, and } from 'drizzle-orm';

export class GroupRepository extends SyncableRepository<Group> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, group);
  }

  /**
   * Get all groups that user is in as a query by user ID
   * @param userId
   * @param includeDeleted
   */
  public getGroupsByUserIdQuery(userId: string, includeDeleted: boolean = false) {
    return this.db
      .select({ group: group })
      .from(group)
      .innerJoin(
        groupMember,
        and(
          eq(group.id, groupMember.group_id),
          includeDeleted ? undefined : eq(groupMember.isDeleted, false),
        ),
      )
      .where(
        and(
          eq(groupMember.user_id, userId),
          includeDeleted ? undefined : eq(group.isDeleted, false),
        ),
      )
      .orderBy(group.createdAt);
  }

  public getGroupNameByIdQuery(groupId: string, includeDeleted: boolean = false) {
    return this.db
      .select({ name: group.name })
      .from(group)
      .where(and(eq(group.id, groupId), includeDeleted ? undefined : eq(group.isDeleted, false)));
  }
}
