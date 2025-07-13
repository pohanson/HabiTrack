import { groupMember, GroupMember } from '@/db/localSchema';
import { SyncableRepository } from './SyncableRepository';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export class GroupMemberRepository extends SyncableRepository<GroupMember> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, groupMember);
  }
}
