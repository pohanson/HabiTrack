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
   * @returns The ID of the created habit.
   */
  public async createHabitWithReminders(habit: HabitInsertionData): Promise<string> {
    const userId = habit.user_id || this.dbService.userId;
    if (userId == null) {
      throw new Error('User ID is required to create a habit');
    }
    const today = new Date().toISOString();
    const { id: habitId } = await this._habitRepository.create({
      ...habit,
      user_id: userId,
      frequencyModifiedAt: today,
    });
    if (habit.frequency && habit.frequency.length > 0) {
      this.dbService.reminder.createRemindersForHabit(habitId, habit.frequency, habit.time);
    }
    return habitId;
  }

  /**
   * Retrieves a habit by its ID as a query.
   */
  public getHabitByIdQuery(habitId: string) {
    return this._habitRepository.getByIdQuery(habitId);
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
   * Gets all habits for a user by user ID
   * @param userId
   * @param includeDeleted
   */
  public getHabitsByUserId(userId: string, includeDeleted: boolean = false) {
    return this._habitRepository.getHabitsByUserIdQuery(userId, includeDeleted).execute();
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
   * Retrieves all habits for the current user or all habits if userId is null. defaults to current user.
   */
  public async getAllHabitsWithReminder(userId: string | null = this.dbService.userId) {
    return this._habitRepository.getAllHabitsWithRemindersQuery(userId).execute();
  }

  /**
   * Retrieves all habits with today's completions, reminder, milestone for the given user.
   */
  public async getAllHabitsToday(userId: string | null = this.dbService.userId) {
    return this._habitRepository.getAllHabitsToday(userId);
  }

  public getHabitStatsWithRemindersQuery() {
    return this._habitRepository.getHabitStatsWithRemindersQuery();
  }

  /**
   * Updates a habit with reminders.
   * @param habit - The habit data to update, **must include `id`**.
   */
  public async updateHabitWithReminders(habit: HabitInsertionData & Pick<Habit, 'id'>) {
    if (!habit.id) {
      throw new Error('Habit ID is required for update');
    }

    // Fetch the old frequency and new frequency
    const oldReminders = await this.dbService.reminder.getRemindersForHabit(habit.id, false);
    const oldFrequency = oldReminders.map((r) => r.day).sort();
    const newFrequency = habit.frequency.sort();

    // Check if the frequency has been edited by comparing old vs new freq
    let freqHasNotBeenEdited = true;
    if (oldFrequency.length !== newFrequency.length) {
      freqHasNotBeenEdited = false;
    } else {
      for (let i = 0; i < oldFrequency.length; i++) {
        freqHasNotBeenEdited = freqHasNotBeenEdited && oldFrequency[i] === newFrequency[i];
      }
    }

    console.log(
      freqHasNotBeenEdited
        ? 'Frequency was not edited for habit: ' + habit.name
        : 'Frequency was edited for habit: ' + habit.name,
    );
    console.log('old freq:', oldFrequency);
    console.log('new freq:', newFrequency);

    // check if there are any (undeleted) completions today
    const todayDate = new Date().toISOString().split('T')[0];
    const todayDOW = new Date(todayDate).getDay();
    const completionsToday = await this.dbService.habitCompletion.getCompletionsForHabit(habit.id, {
      completedAt: todayDate,
    });

    const updatedData: any = { ...habit };
    if (!freqHasNotBeenEdited) {
      updatedData.frequencyModifiedAt = new Date().toISOString();
      // RESET MILESTONE DATA FOR THIS HABIT
      await this.dbService.habitMilestone.updateMilestoneByHabitId(habit.id, {
        week_streak: 0,
        badges_earned: 0,
        // streak_started_at should be set to 'inactive' UNLESS (there is an undeleted completion today && todayDOW is in newFreq)
        streak_started_at:
          completionsToday.length > 0 && newFrequency.includes(todayDOW) ? todayDate : 'inactive',
        best_day_streak: 0,
        prev_best_day_streak: -1,
        modifiedAt: new Date().toISOString(),
      });
    }

    console.log('frequencyModifiedAt:', updatedData.frequencyModifiedAt);

    await this._habitRepository.update(updatedData);
    this.dbService.reminder.updateRemindersForHabit(habit.id, habit.frequency, habit.time);
  }

  /**
   * Soft deletes a habit and its associated reminders and completions.
   */
  public async deleteHabit(habitId: string) {
    this.dbService.habitCompletion.deleteCompletionsForHabit(habitId);
    this.dbService.reminder.deleteRemindersForHabit(habitId);
    this.dbService.habitMilestone.deleteMilestoneByHabitId(habitId);
    await this._habitRepository.delete(habitId);
  }

  /**
   * Calculates the completion rate statistics for a habit by its ID.
   * Returns an array of objects: {
   *    startDate: string;
   *    expectedNoOfDays: number;
   *    actualNoOfDays: number
   * }
   * @param habitId
   */
  public async getCompletionRateStatsByHabitId(habitId: string) {
    try {
      // fetch habit first
      const habit = await this._habitRepository.getById(habitId);
      if (!habit) {
        throw new Error('Habit with ID ' + habitId + ' not found');
      }

      // fetch start date (frequencyLastModifiedAt or createdAt, whichever is later)
      const createdAtDate = String(habit.createdAt).split('T')[0]; // yyyy-mm-dd
      const frequencyLastModifiedAt = String(habit.frequencyModifiedAt).split('T')[0]; // yyyy-mm-dd
      const startDate =
        frequencyLastModifiedAt > createdAtDate ? frequencyLastModifiedAt : createdAtDate;

      const startDateIso = new Date(startDate + 'T00:00:00.000Z').toISOString();

      // fetch completion data for the habit
      const completions = await this.dbService.habitCompletion.getCompletionsForHabit(habitId, {
        completedStart: startDateIso,
      });

      // get frequency array for this habit
      const freqData = await this.dbService.reminder.getRemindersForHabitQuery(habitId).execute();
      const freq = freqData?.map((r) => r.day).sort() || [];
      const freqSet = new Set(freq);

      // filter out phantom completedAt
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDOW = new Date(todayStr).getDay();
      const filteredCompletions = completions
        .map((entry) => ({
          completedAt: String(entry.completedAt).split('T')[0],
        }))
        .filter((entry) => {
          // don't include today's completedAt if today is not in freq
          if (entry.completedAt === todayStr && !freq.includes(todayDOW)) {
            return false;
          }
          // don't include completions on days not in freq (phantom completions)
          const dow = new Date(entry.completedAt).getDay();
          if (!freqSet.has(dow)) {
            return false;
          }
          return entry.completedAt >= startDate;
        });

      // return the stats, array of:
      // {
      //    startDate: string;
      //    expectedNoOfDays: number;
      //    actualNoOfDays: number;
      // }
      return this.dbService.statistic.calcHabitStatistics(startDate, freq, filteredCompletions);
    } catch (error) {
      console.error('Error getting habit completion rate stats for habit: ' + habitId, error);
      throw error;
    }
  }
}
