import { InsertUser, User } from '@/db/schema';
import { UserRepository } from '@/repositories/UserRepository';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';

import bcrypt from 'react-native-bcrypt';
import { SQLiteRunResult } from 'expo-sqlite';

export class UserService extends BaseSyncableRepoService {
  static #instance: UserService;
  private dbService: DatabaseService;
  private _userRepository: UserRepository;

  private constructor(dbService: DatabaseService) {
    const userRepo = new UserRepository(dbService.db);
    super(userRepo, 'user');
    this.dbService = dbService;
    this._userRepository = userRepo;
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

  public searchUser(searchStr: string): Promise<User[]> {
    const lowerCaseSearchStr = searchStr.toLowerCase();
    return this._userRepository
      .searchUser(lowerCaseSearchStr)
      .then((users) => {
        return users;
      })
      .catch((error) => {
        console.error('Error searching for user:', error);
        throw new Error(`Failed to search user: ${error.message}`);
      });
  }

  public async signupUser(user: Omit<InsertUser, 'id'> & Partial<Pick<User, 'id'>>): Promise<User> {
    // check to ensure required fields are present
    if (!user.username || !user.name || !user.password) {
      console.error('Missing required fields for user creation:', user);
      throw new Error('One of username, name, and password missing.');
    }
    if (user.password.length < 6 || user.password.length > 18) {
      console.error('Password must be between 6 and 18 characters long.');
      throw new Error('Password must be between 6 and 18 characters long.');
    }

    user.id = UserRepository.generateId();

    user.password = bcrypt.hashSync(user.password);
    user.createdAt = user.createdAt || new Date().toISOString();
    user.modifiedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('user')
      .insert(user, { count: 'exact' })
      .select()
      .single();
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    console.log('User created successfully:', data);
    this._userRepository.create(data as User).catch((err) => {
      console.error('Error inserting user into local database:', err);
      throw new Error(`Failed to create user: ${err.message}`);
    });
    return data as User;
  }

  /**
   * Retrieves a user by their usename.
   * @returns User if found, otherwise null
   */
  public getUserByUsername(username: string): Promise<User | null> {
    return this._userRepository.getUserByUsername(username);
  }

  public getUserById(userId: string): Promise<User | null> {
    return this._userRepository.getById(userId).then((user) => {
      if (user) {
        return user;
      } else {
        console.warn(`User with ID ${userId} not found.`);
        return null;
      }
    });
  }

  public async updateUser(user: Partial<User>): Promise<SQLiteRunResult> {
    if (!user.id) {
      console.error('User ID is required for update.');
      throw new Error('User ID is required for update.');
    }
    user.modifiedAt = new Date().toISOString();
    return this._userRepository.update(user as User).catch((err) => {
      console.error('Error updating user in local database:', err);
      throw new Error(`Failed to update user: ${err.message}`);
    });
  }

  public async checkValidUsername(username: string): Promise<boolean> {
    if (username.length === 0) {
      return false;
    }

    return supabase
      .from('user')
      .select('username', { count: 'exact' })
      .ilike('username', username)
      .then((res) => {
        console.log(res);
        return res.count === 0;
      });
  }

  public async signinUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    console.log('User found:', user);
    if (!user) {
      return null;
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    await AsyncStorage.setItem('userId', user.id).catch(console.error);
    this.dbService.userId = user.id;
    return user;
  }

  public async signoutUser() {
    await AsyncStorage.removeItem('userId').catch(console.error);
  }

  public async getCurrentUser(): Promise<User | null> {
    const userId = this.dbService.userId;
    return userId ? this.getUserById(userId) : null;
  }
  
  /**
   * Retrieves a username by their user ID.
   * @returns string if found, otherwise null
   */
  public async getUsernameById(userId: string): Promise<string | null> {
    const user = await this._userRepository.getById(userId);
    if (user) {
      return user.username;
    }
    console.warn(`User with ID ${userId} not found.`);
    return null;
  }

  /**
   * Retrieves total no. of badges earned of all habits of a user by user ID
   * @param userId
   */
  public async getTotalBadgesEarnedByUserId(userId: string) {
    // [habit, habit, habit...]
    const habitArray = await this.dbService.habit.getHabitsByUserId(userId);
    // converts array of habit rows into habit id strings [String, String, String...]
    const habitIds = habitArray.map((habit) => String(habit.id));

    // case where user has no habits, return 0
    if (habitIds.length === 0) {
      return 0;
    }

    // iterate through array and sum up the badges earned
    let result = 0;
    for (let i = 0; i < habitIds.length; i++) {
      const badgesEarned = await this.dbService.habitMilestone.getBadgesEarnedByHabitId(
        habitIds[i],
      );
      result += badgesEarned;
    }

    return result;
  }

  public async getTotalCompletionRateStatsByUserId(userId: string) {
    // get all habits of the user first [habit1, habit2,...]
    const habits = await this.dbService.habit.getHabitsByUserId(userId);

    // convert to array of habit Id strings [habitId1, habitId2,...]
    const habitIdsArray = habits.map((habit) => String(habit.id));

    // convert to array of completion rate stats
    const completionRatesArray = await Promise.all(
      habitIdsArray.map((habitId) => this.dbService.habit.getCompletionRateStatsByHabitId(habitId)),
    );

    let totalNoOfExpectedDays = 0;
    let totalNoOfActualDays = 0;

    for (let i = 0; i < completionRatesArray.length; i++) {
      const stats = completionRatesArray[i]('all');
      totalNoOfExpectedDays += stats.expectedNoOfDays;
      totalNoOfActualDays += stats.actualNoOfDays;
    }

    console.log('Total Completion Rate Stats for User ID:', userId);
    console.log('Total No. of Actual Days:', totalNoOfActualDays);
    console.log('Total No. of Expected Days:', totalNoOfExpectedDays);
    console.log('////////////////////////////////////////////////////////////////////////');

    return {
      totalNoOfExpectedDays,
      totalNoOfActualDays,
    };
  }
}
