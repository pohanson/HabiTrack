import { HabitMilestone } from '@/db/schema';
import { HabitMilestoneRepository } from '@/repositories/HabitMilestoneRepository';
import { PartialSync } from '@/repositories/SyncableRepository';
import { calculateDaysBetweenDates } from '@/utils/dateUtils';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DatabaseService } from './DatabaseService';

export class HabitMilestoneService extends BaseSyncableRepoService {
  static #instance: HabitMilestoneService;
  private dbService: DatabaseService;
  private _habitMilestoneRepository: HabitMilestoneRepository;

  private constructor(dbService: DatabaseService) {
    const tempRepo = new HabitMilestoneRepository(dbService.db);
    super(tempRepo, 'habit_milestone');
    this._habitMilestoneRepository = tempRepo;
    this.dbService = dbService;
  }

  public static get instance() {
    return HabitMilestoneService.#instance;
  }

  public static init(dbService: DatabaseService): HabitMilestoneService {
    if (!HabitMilestoneService.#instance) {
      HabitMilestoneService.#instance = new HabitMilestoneService(dbService);
    }
    return HabitMilestoneService.#instance;
  }

  /**
   * Create a new habit milestone.
   */
  public async createMilestone(habitMilestone: PartialSync<HabitMilestone>) {
    return this._habitMilestoneRepository.create(habitMilestone);
  }

  /**
   * Get all habit milestones as a query.
   */
  public getAllMilestonesQuery() {
    return this._habitMilestoneRepository.getAllQuery();
  }

  /**
   * Get all milestones for a habit as a query.
   */
  public getMilestonesByHabitIdQuery(habitId: string, includeDeleted: boolean = false) {
    return this._habitMilestoneRepository.getMilestonesByHabitIdQuery(habitId, includeDeleted);
  }

  /**
   * Update milestones for a habit by habit Id. Partial updates.
   */
  public updateMilestoneByHabitId(habitId: string, updates: Partial<HabitMilestone>) {
    return this._habitMilestoneRepository.updateByHabitId(habitId, updates);
  }

  /**
   * Reset the week streak for a habit by habit Id.
   */
  public resetWeekStreakByHabitId(habitId: string) {
    this._habitMilestoneRepository.updateByHabitId(habitId, {
      week_streak: 0,
    });
  }

  public async deleteMilestoneByHabitId(habitId: string) {
    return this._habitMilestoneRepository.deleteByHabitId(habitId);
  }

  /**
   * Calculate the habit streak for a given habit Id.
   * @param habitId - The ID of the habit to calculate the streak for.
   * @param freq - A sorted array of the days of the week the habit is to be completed on (0 for Sunday, 1 for Monday, etc).
   * @param completedAtData - yyyy-mm-dd array of obj.
   * @param includeDeleted - Whether to include soft-deleted items.
   */
  public async calculateHabitStreak(
    habitId: string,
    freq: number[],
    completedAtData: { completedAt: string }[],
    includeDeleted: boolean = false,
  ): Promise<{ badgesEarned: number; bestStreak: number; activeStreak: number }> {
    const data = await this.getMilestonesByHabitIdQuery(habitId, includeDeleted);
    const today = new Date();

    // get streak_started_at as a string
    const streakStartedAt = data?.[0]?.streak_started_at || '';

    // get best_day_streak as a number
    const bestStreak = Number(data?.[0]?.best_day_streak);

    // Calculate active streak
    const todayStr = today.toJSON()?.split('T')[0];
    const todayDOW = today.getDay();
    // check if today is an expected day
    const todayIsAnExpectedDay = freq.includes(todayDOW);
    // check if today was completed for this habit
    const todayHasCompletedAt = completedAtData.some(({ completedAt }) => completedAt === todayStr);
    let activeStreak = 0;
    if (streakStartedAt === 'inactive') {
      activeStreak = 0;
    } else {
      const daysBetween = calculateDaysBetweenDates(streakStartedAt, todayStr);
      if (todayIsAnExpectedDay) {
        if (todayHasCompletedAt) {
          activeStreak = daysBetween + 1;
        } else {
          activeStreak = daysBetween;
        }
      } else {
        activeStreak = daysBetween + 1;
      }
    }
    return {
      badgesEarned: data[0].badges_earned || 0,
      bestStreak,
      activeStreak,
    };
  }
}
