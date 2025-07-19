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

  public getMembersByGroupId(groupId: string, includeDeleted: boolean = false) {
    return this._groupMemberRepository.getMembersByGroupIdQuery(groupId, includeDeleted);
  }

  public getNumberOfMembersByGroupId(groupId: string, includeDeleted: boolean = false) {
    return this.getMembersByGroupId(groupId, includeDeleted).then((query) => query.length);
  }

  public async getMembersRankedByBadgesEarned(groupId: string, includeDeleted: boolean = false) {
    const groupMembers = await this.getMembersByGroupId(groupId, includeDeleted);
    const userIds = groupMembers.map((entry) => String(entry.groupMember.user_id));

    const userArray = await Promise.all(
      userIds.map((userId) => this.dbService.user.getUserById(userId)),
    );
    const totalBadgesEarnedArray = await Promise.all(
      userIds.map(async (userId) => {
        const result = await this.dbService.user.getTotalBadgesEarnedByUserId(userId);
        return result;
      }),
    );

    const membersWithTotalBadges = await Promise.all(
      groupMembers.map(async (entry, idx) => ({
        rank: 0,
        user: userArray[idx],
        totalBadgesEarned: totalBadgesEarnedArray[idx],
      })),
    );

    const rankedMembers = membersWithTotalBadges
      .sort((first, second) => second.totalBadgesEarned - first.totalBadgesEarned)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));

    return rankedMembers;
  }
}
