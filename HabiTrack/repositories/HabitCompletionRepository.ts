import { HabitCompletion, habitCompletion } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncRepository';

export class HabitCompletionRepository extends SyncableRepository<HabitCompletion> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, habitCompletion);
  }

  /**
   * Get all completions given a habit Id.
   * @param habitId Habit Id to get all completions for
   * @param completedAt yyyy-mm-dd format, defaults to null for no filtering by date
   * @param includeDeleted whether to include soft deleted completions, defaults to false
   */
  public async getCompletionsForHabit(
    habitId: string,
    completedAt: string | null = null,
    includeDeleted = false,
  ): Promise<HabitCompletion[]> {
    return this.db
      .select()
      .from(habitCompletion)
      .where(
        and(
          eq(habitCompletion.habit_id, habitId),
          completedAt ? eq(habitCompletion.completedAt, completedAt) : undefined,
          includeDeleted ? undefined : eq(habitCompletion.isDeleted, false),
        ),
      )
      .execute();
  }

  /**
   * Soft delete all completions for a given habit.
   */
  public async deleteCompletionsForHabit(habitId: string): Promise<void> {
    await this.db
      .update(habitCompletion)
      .set({ isDeleted: true, modifiedAt: new Date().toISOString() })
      .where(eq(habitCompletion.habit_id, habitId))
      .execute();
  }
}
