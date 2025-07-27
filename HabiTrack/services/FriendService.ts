import { FriendRepository } from '@/repositories/FriendRepository';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';

export class FriendService extends BaseSyncableRepoService {
  static #instance: FriendService;
  private dbService: DatabaseService;
  private _friendRepository: FriendRepository;

  private constructor(dbService: DatabaseService) {
    const friendRepo = new FriendRepository(dbService.db);
    super(friendRepo, 'friend');
    this._friendRepository = friendRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return FriendService.#instance;
  }

  public static init(dbService: DatabaseService): FriendService {
    if (!FriendService.#instance) {
      FriendService.#instance = new FriendService(dbService);
    }
    return FriendService.#instance;
  }

  public async addFriend(friendId: string) {
    const userId = this.dbService.userId;
    if (!userId || !friendId) {
      throw new Error('User ID and Friend ID are required to add a friend');
    }
    const existingFriendship = await this._friendRepository.getFriendship(userId, friendId);
    if (!existingFriendship) {
      this._friendRepository.addFriend(userId, friendId);
      return;
    }

    if (existingFriendship.status === 'PENDING') {
      if (existingFriendship.friend_id === userId) {
        this._friendRepository.update({ id: existingFriendship.id, status: 'ACCEPTED' });
      } else {
        throw new Error('Pending friend request.');
      }
    }
    if (existingFriendship.status === 'REJECTED') {
      this._friendRepository.update({ id: existingFriendship.id, status: 'PENDING' });
    }
  }

  public async getIncomingPendingRequests() {
    const user_id = this.dbService.userId || '';
    return this._friendRepository
      .getFriendsByUserIdQuery(this.dbService.userId || '', 'PENDING')
      .then((data) => {
        return Promise.all(
          data
            .filter((friend) => !friend.isDeleted && friend.friend_id === user_id)
            .map((friend) => this.dbService.user.getUserById(friend.user_id)),
        ).then((data) => data.filter((data) => data !== null));
      });
  }

  public async getUserFriends() {
    const user_id = this.dbService.userId || '';
    return this._friendRepository
      .getFriendsByUserIdQuery(this.dbService.userId || '', 'ACCEPTED')
      .then((data) =>
        Promise.all(
          data
            .map((friend) => (friend.friend_id === user_id ? friend.user_id : friend.friend_id))
            .map((friendId) => this.dbService.user.getUserById(friendId)),
        ).then((data) => data.filter((data) => data !== null)),
      );
  }

  public async setFriendRequestStatus(
    friendId: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ) {
    const userId = this.dbService.userId;
    if (!userId || !friendId) {
      throw new Error('User ID and Friend ID are required to accept a friend request');
    }
    const existingFriendship = await this._friendRepository.getFriendship(userId, friendId);
    if (!existingFriendship) {
      throw new Error('No pending friend request found');
    }
    console.log('existingFriendship:', existingFriendship);
    await this._friendRepository.update({ id: existingFriendship.id, status: status });
  }
  public async acceptFriendRequest(friendId: string) {
    console.log('Accepting friend request for:', friendId);
    return this.setFriendRequestStatus(friendId, 'ACCEPTED');
  }
  public async rejectFriendRequest(friendId: string) {
    return this.setFriendRequestStatus(friendId, 'REJECTED');
  }
}
