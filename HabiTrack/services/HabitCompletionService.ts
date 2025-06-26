import { HabitCompletionRepository } from '@/repositories/HabitCompletionRepository';
import { DatabaseService } from './DatabaseService';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { HabitCompletion } from '@/db/schema';

export class HabitCompletionService extends BaseSyncableRepoService {
  static #instance: HabitCompletionService;
  private dbService: DatabaseService;
  private _habitCompletionRepository: HabitCompletionRepository;

  private constructor(dbService: DatabaseService) {
    const tempRepo = new HabitCompletionRepository(dbService.db);
    super(tempRepo, 'habit_completion');
    this._habitCompletionRepository = tempRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return HabitCompletionService.#instance;
  }

  public static init(dbService: DatabaseService): HabitCompletionService {
    if (!HabitCompletionService.#instance) {
      HabitCompletionService.#instance = new HabitCompletionService(dbService);
    }
    return HabitCompletionService.#instance;
  }

  /**
   * Get all completions given a habit Id as a query.
   * @param habitId Habit Id to get all completions for
   * @param filtering defaults to null which means no filtering, and conditions are unioned. Pass a ISO datetime str.
   *  - completedStart: filter completions starting from this date (inclusive) and
   *  - completedAt: filter completions for this exact date and
   *  - completedEnd: filter completions up to this date (inclusive)
   * @param includeDeleted whether to include soft deleted completions, defaults to false
   */
  public getCompletionsForHabitQuery(
    habitId: string,
    filtering: {
      completedStart?: string | null;
      completedAt?: string | null;
      completedEnd?: string | null;
    } = {},
    includeDeleted: boolean = false,
  ) {
    return this._habitCompletionRepository.getCompletionsForHabitQuery(
      habitId,
      filtering,
      includeDeleted,
    );
  }

  /**
   * Get all completions given a habit Id.
   * @param habitId Habit Id to get all completions for
   * @param filtering defaults to null which means no filtering, and conditions are unioned. Pass a ISO datetime str.
   *  - completedStart: filter completions starting from this date (inclusive) and
   *  - completedAt: filter completions for this exact date and
   *  - completedEnd: filter completions up to this date (inclusive)
   * @param includeDeleted whether to include soft deleted completions, defaults to false
   */
  public getCompletionsForHabit(
    habitId: string,
    filtering: {
      completedStart?: string | null;
      completedAt?: string | null;
      completedEnd?: string | null;
    } = {},
    includeDeleted: boolean = false,
  ): Promise<HabitCompletion[]> {
    return this.getCompletionsForHabitQuery(habitId, filtering, includeDeleted).execute();
  }

  /**
   * Soft delete all completions for a given habit.
   */
  public async deleteCompletionsForHabit(habitId: string) {
    this._habitCompletionRepository.deleteCompletionsForHabit(habitId);
  }

  /**
   * Toggle the completion of the specified habit for today.
   */
  public async toggleTodayHabitCompletion(habitId: string) {
    const today = new Date().toISOString().split('T')[0];
    const result = await this.getCompletionsForHabit(habitId, { completedAt: today }, true);
    const habitCompletion = result.length > 0 ? result[0] : null;
    if (habitCompletion === null) {
      // No Completion Exists, hence it is not completed today. I will add a new completion.
      this._habitCompletionRepository.create({ habit_id: habitId, completedAt: today });
    } else {
      this._habitCompletionRepository.update({
        id: habitCompletion.id,
        isDeleted: !habitCompletion.isDeleted,
      });
    }
  }

  //
  /**
   * Get the completedAt dates for a habit since Sunday as an array of date strings yyyy-mm-dd
   */
  public async getCompletionsThisWeek(habitId: string): Promise<string[]> {
    try {
      const todayDate = new Date();
      const lastSundayDate = new Date();
      lastSundayDate.setDate(todayDate.getDate() - todayDate.getDay());
      const lastSundayDateStr = lastSundayDate.toJSON().split('T')[0];
      const complete = await this.getCompletionsForHabit(habitId, {
        completedStart: lastSundayDateStr,
      });
      return complete.map((obj) => obj.completedAt as string);
    } catch (error) {
      console.error('Error in getCompletionsThisWeek:', error);
      return [];
    }
  }
}
