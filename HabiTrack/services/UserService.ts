import { UserRepository } from '@/repositories/UserRepository';
import { DatabaseService } from './DatabaseService';
import { User } from '@/db/schema';

export class UserService {
  static #instance: UserService;
  private dbService: DatabaseService;
  private _userRepository: UserRepository;
  private constructor(dbService: DatabaseService) {
    this.dbService = dbService;
    this._userRepository = new UserRepository(dbService.db);
  }

  public static get instance() {
    return UserService.#instance;
  }

  public static init(dbService: DatabaseService): UserService {
    if (!UserService.#instance) {
      UserService.#instance = new UserService(dbService);
    }
    return UserService.#instance;
  }

  /**
   * Retrieves a user by their usename.
   * @returns User if found, otherwise null
   */
  public getUserByUsername(username: string): Promise<User | null> {
    return this._userRepository.getUserByUsername(username);
  }
}
