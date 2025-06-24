import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { HabitCompletionService } from './HabitCompletionService';
import { HabitService } from './HabitService';
import { ReminderService } from './ReminderService';
import { UserService } from './UserService';

export class DatabaseService {
  static #instance: DatabaseService;
  private _db: ReturnType<typeof drizzle>;
  private _userId: string = 'CURRENT_USER';

  private _habitCompletionService: HabitCompletionService;
  private _habitService: HabitService;
  private _reminderService: ReminderService;
  private _userService: UserService;

  private constructor(expoDb: SQLiteDatabase) {
    this._db = drizzle(expoDb);
    /* IMPT NOTE: Order of init should be one where services that
     * depend on others are initialized after their dependencies.
     * Eg. userService is initialized before habit
     */
    this._userService = UserService.init(this);
    this._habitService = HabitService.init(this);
    this._reminderService = ReminderService.init(this);
    this._habitCompletionService = HabitCompletionService.init(this);
  }

  public static init(db: SQLiteDatabase, userId: string = 'CURRENT_USER') {
    if (!DatabaseService.#instance) {
      DatabaseService.#instance = new DatabaseService(db);
    }
    return DatabaseService.#instance;
  }

  public static get instance() {
    return DatabaseService.#instance;
  }

  public get db() {
    return this._db;
  }

  public get userId() {
    return this._userId;
  }

  public set userId(value: string) {
    // TODO: Add validation for userid
    this._userId = value;
  }

  public get habitCompletion() {
    return this._habitCompletionService;
  }

  public get habit() {
    return this._habitService;
  }

  public get reminder() {
    return this._reminderService;
  }

  public get user() {
    return this._userService;
  }
}
