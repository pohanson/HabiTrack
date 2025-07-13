import { GroupRepository } from '@/repositories/GroupRepository';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';
import { Group } from '@/db/localSchema';
import { GroupMemberRepository } from '@/repositories/GroupMemberRepository';

export type GroupInsertionData = Pick<Group, 'name'> & {
  memberIds?: string[];
};

export class GroupService extends BaseSyncableRepoService {
  static #instance: GroupService;
  private dbService: DatabaseService;
  private _groupRepository: GroupRepository;

  // grpmember repo
  private _groupMemberRepository: GroupMemberRepository;

  private constructor(dbService: DatabaseService) {
    const groupRepo = new GroupRepository(dbService.db);
    super(groupRepo, 'group');
    this._groupRepository = groupRepo;
    this.dbService = dbService;

    // grpmember repo
    const groupMemberRepo = new GroupMemberRepository(dbService.db);
    this._groupMemberRepository = groupMemberRepo;
  }

  public static get instance() {
    return GroupService.#instance;
  }

  public static init(dbService: DatabaseService): GroupService {
    if (!GroupService.#instance) {
      GroupService.#instance = new GroupService(dbService);
    }
    return GroupService.#instance;
  }

  /**
   * Creates a new group
   * @returns The ID of the created group.
   */
  public async createGroup(group: GroupInsertionData): Promise<string> {
    // getting admin ID (current user)
    const adminId = this.dbService.userId;
    if (adminId == null) {
      throw new Error('User ID is required to create a group');
    }

    // create new group row
    const { id: groupId } = await this._groupRepository.create({
      name: group.name,
      admin_id: adminId,
    });

    // add admin as 1st member of created group
    await this._groupMemberRepository.create({
      group_id: groupId,
      user_id: adminId,
    });

    // add the other members into the created group (if there are any)
    if (group.memberIds && group.memberIds.length > 0) {
      for (const memberId of group.memberIds) {
        await this._groupMemberRepository.create({
          group_id: groupId,
          user_id: memberId,
        });
      }
    }

    // return this group's Id
    return groupId;
  }
}
