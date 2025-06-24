import { Habit, Reminder } from '@/db/schema';
import { HabitRepository } from '@/repositories/HabitRepository';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';

export type HabitInsertionData = Pick<Habit, 'name' | 'description' | 'user_id'> & {
  time: Date | null;
  frequency: number[];
};

export class HabitService extends BaseSyncableRepoService {
  static #instance: HabitService;
  private dbService: DatabaseService;
  private _habitRepository: HabitRepository;

  private constructor(dbService: DatabaseService) {
    const habitRepo = new HabitRepository(dbService.db);
    super(habitRepo, 'habit');
    this._habitRepository = habitRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return HabitService.#instance;
  }

  public static init(dbService: DatabaseService): HabitService {
    if (!HabitService.#instance) {
      HabitService.#instance = new HabitService(dbService);
    }
    return HabitService.#instance;
  }

  /**
   * Creates a new habit with reminders.
   */
  public createHabitWithReminders(habit: HabitInsertionData) {
    const userId = habit.user_id || this.dbService.userId;
    this._habitRepository.create({ ...habit, user_id: userId }).then(({ id: habitId }) => {
      if (habit.frequency && habit.frequency.length > 0) {
        this.dbService.reminder.createRemindersForHabit(habitId, habit.frequency, habit.time);
      }
    });
  }

  /**
   * Retrieves all habits for the current user or all habits if no user ID is provided.
   */
  public async getAllHabits(userId: string | null = this.dbService.userId): Promise<Habit[]> {
    if (userId == null) {
      return this._habitRepository.getAll();
    } else {
      return await this._habitRepository.getHabitsByUserIdQuery(userId);
    }
  }

  /**
   * Same as getAllHabits, but returns a query.
   */
  public getAllHabitsQuery(userId: string | null = this.dbService.userId) {
    if (userId == null) {
      return this._habitRepository.getAllQuery();
    } else {
      return this._habitRepository.getHabitsByUserIdQuery(userId);
    }
  }

  /**
   * Retrieves a habit with its reminders by habit ID.
   */
  public async getHabitWithReminders(
    habitId: string,
  ): Promise<{ habit: Habit; reminders: Reminder[] } | null> {
    return this._habitRepository.getHabitWithRemindersQuery(habitId).then((values) => {
      if (values.length === 0) {
        return null;
      }
      const habit = values[0].habit as Habit;
      const reminders = values.map((value) => value.reminder as Reminder).filter((r) => r != null);
      return { habit, reminders };
    });
  }

  /**
   * Retrieves all habits with today's completions for the given user.
   */
  public getAllHabitsWithTodayCompletionsQuery(userId: string | null = this.dbService.userId) {
    return this._habitRepository.getAllHabitsWithTodayCompletionsQuery(userId);
  }

  /**
   * Updates a habit with reminders.
   * @param habit - The habit data to update, **must include `id`**.
   */
  public async updateHabitWithReminders(habit: HabitInsertionData & Pick<Habit, 'id'>) {
    if (!habit.id) {
      throw new Error('Habit ID is required for update');
    }
    this._habitRepository.update(habit);
    this.dbService.reminder.updateRemindersForHabit(habit.id, habit.frequency, habit.time);
  }

  /**
   * Soft deletes a habit and its associated reminders and completions.
   */
  public async deleteHabit(habitId: string) {
    this.dbService.habitCompletion.deleteCompletionsForHabit(habitId);
    this.dbService.reminder.deleteRemindersForHabit(habitId);
    await this._habitRepository.delete(habitId);
  }
}
