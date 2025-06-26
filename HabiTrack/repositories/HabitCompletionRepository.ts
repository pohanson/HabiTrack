import { HabitCompletion, habitCompletion } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';

export class HabitCompletionRepository extends SyncableRepository<HabitCompletion> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, habitCompletion);
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
    const { completedStart = null, completedAt = null, completedEnd = null } = filtering || {};
    return this.db
      .select()
      .from(habitCompletion)
      .where(
        and(
          eq(habitCompletion.habit_id, habitId),
          completedStart ? gte(habitCompletion.completedAt, completedStart) : undefined,
          completedAt ? eq(habitCompletion.completedAt, completedAt) : undefined,
          completedEnd ? lte(habitCompletion.completedAt, completedEnd) : undefined,
          includeDeleted ? undefined : eq(habitCompletion.isDeleted, false),
        ),
      );
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
