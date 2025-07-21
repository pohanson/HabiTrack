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

  public async getMembersRankedByCompletionRate(groupId: string, includeDeleted: boolean = false) {
    // get array of user IDs in the group
    const groupMembers = await this.getMembersByGroupId(groupId, includeDeleted);
    const userIds = groupMembers.map((entry) => String(entry.groupMember.user_id));

    // map each user ID to a completion rate stat { totalNoOfExpectedDays: number, totalNoOfExpectedDays: number }
    const totalCompletionRateStatsArray = await Promise.all(
      userIds.map((userId) => this.dbService.user.getTotalCompletionRateStatsByUserId(userId)),
    );

    // get array of Users
    const userArray = await Promise.all(
      userIds.map((userId) => this.dbService.user.getUserById(userId)),
    );

    // get array of {
    //  rank: number,
    //  user: User,
    //  totalCompletionRateStats: { totalNoOfExpectedDays: number, totalNoOfActualDays: number }
    // }
    const membersWithCompletionRateStats = await Promise.all(
      groupMembers.map(async (entry, idx) => ({
        rank: 0,
        user: userArray[idx],
        totalCompletionRateStats: totalCompletionRateStatsArray[idx],
      })),
    );

    // rank the members
    const rankedMembers = membersWithCompletionRateStats
      .sort((first, second) => {
        const firstPercent =
          first.totalCompletionRateStats.totalNoOfExpectedDays === 0
            ? // makes sure users with 0 expected days are properly sorted as having 0%
              0
            : first.totalCompletionRateStats.totalNoOfActualDays /
              first.totalCompletionRateStats.totalNoOfExpectedDays;
        const secondPercent =
          second.totalCompletionRateStats.totalNoOfExpectedDays === 0
            ? // makes sure users with 0 expected days are properly sorted as having 0%
              0
            : second.totalCompletionRateStats.totalNoOfActualDays /
              second.totalCompletionRateStats.totalNoOfExpectedDays;
        return secondPercent - firstPercent;
      })
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));

    return rankedMembers;
  }

  public leaveGroup(groupId: string, userId: string | null = this.dbService.userId) {
    if (userId == null) {
      throw new Error('User ID is required to leave a group');
    }
    return this._groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
  }
}
