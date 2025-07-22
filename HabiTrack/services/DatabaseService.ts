import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { HabitCompletionService } from './HabitCompletionService';
import { HabitService } from './HabitService';
import { ReminderService } from './ReminderService';
import { UserService } from './UserService';
import { HabitMilestoneService } from './HabitMilestoneService';
import { StatisticService } from './StatisticService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FriendService } from './FriendService';
import { GroupService } from './GroupService';
import { GroupMemberService } from './GroupMemberService';

export class DatabaseService {
  static #instance: DatabaseService;
  private _db: ReturnType<typeof drizzle>;
  private _userId: string | null = null;

  private _habitCompletionService: HabitCompletionService;
  private _habitService: HabitService;
  private _reminderService: ReminderService;
  private _userService: UserService;
  private _habitMilestoneService: HabitMilestoneService; // Placeholder for HabitMilestoneService, if needed
  private _statisticService: StatisticService;
  private _friendService: FriendService;
  private _groupService: GroupService;
  private _groupMemberService: GroupMemberService;

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
    this._habitMilestoneService = HabitMilestoneService.init(this);
    this._statisticService = StatisticService.init(this);
    this._friendService = FriendService.init(this);
    this._groupService = GroupService.init(this);
    this._groupMemberService = GroupMemberService.init(this);
  }

  public static init(db: SQLiteDatabase) {
    if (!DatabaseService.#instance) {
      DatabaseService.#instance = new DatabaseService(db);
    }

    AsyncStorage.getItem('userId')
      .then((userId) => {
        DatabaseService.instance.userId = userId;
      })
      .catch(console.error);

    return DatabaseService.#instance;
  }

  public static get instance() {
    return DatabaseService.#instance;
  }

  public get db() {
    return this._db;
  }

  public get userId(): string | null {
    return this._userId;
  }

  public set userId(value: string | null) {
    if (value === null) {
      this._userId = null;
    } else {
      this.user.getUsernameById(value).then((username) => {
        if (username) {
          this._userId = value;
        }
      });
    }
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

  public get habitMilestone() {
    return this._habitMilestoneService;
  }

  public get statistic() {
    return this._statisticService;
  }

  public get friend() {
    return this._friendService;
  }

  public get group() {
    return this._groupService;
  }

  public get groupMember() {
    return this._groupMemberService;
  }
}
