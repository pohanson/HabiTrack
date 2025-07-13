import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';
import { group, Group } from '@/db/localSchema';

export class GroupRepository extends SyncableRepository<Group> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, group);
  }
}
