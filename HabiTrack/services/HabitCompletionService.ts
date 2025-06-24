import { HabitCompletionRepository } from '@/repositories/HabitCompletionRepository';
import { DatabaseService } from './DatabaseService';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';

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
    const result = await this._habitCompletionRepository.getCompletionsForHabit(
      habitId,
      today,
      true,
    );
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
}
