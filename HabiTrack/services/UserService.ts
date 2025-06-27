import { InsertUser, User } from '@/db/schema';
import { UserRepository } from '@/repositories/UserRepository';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';

import bcrypt from 'react-native-bcrypt';

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

  public async checkValidUsername(username: string): Promise<boolean> {
    if (username.length === 0) {
      return false;
    }

    return supabase
      .from('user')
      .select('username', { count: 'exact' })
      .eq('username', username)
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
}
