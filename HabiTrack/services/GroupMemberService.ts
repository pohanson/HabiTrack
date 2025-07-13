import { GroupMemberRepository } from '@/repositories/GroupMemberRepository';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';
import { GroupMember } from '@/db/localSchema';

export type GroupMemberInsertionData = Pick<GroupMember, 'group_id' | 'user_id'>;

export class GroupMemberService extends BaseSyncableRepoService {
  static #instance: GroupMemberService;
  private dbService: DatabaseService;
  private _groupMemberRepository: GroupMemberRepository;

  private constructor(dbService: DatabaseService) {
    const groupMemberRepo = new GroupMemberRepository(dbService.db);
    super(groupMemberRepo, 'group_member');
    this._groupMemberRepository = groupMemberRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return GroupMemberService.#instance;
  }

  public static init(dbService: DatabaseService): GroupMemberService {
    if (!GroupMemberService.#instance) {
      GroupMemberService.#instance = new GroupMemberService(dbService);
    }
    return GroupMemberService.#instance;
  }
}
