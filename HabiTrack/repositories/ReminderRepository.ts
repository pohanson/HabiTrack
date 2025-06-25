import { Reminder, reminder } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteRunResult } from 'expo-sqlite';
import { SyncableRepository } from './SyncRepository';

export class ReminderRepository extends SyncableRepository<Reminder> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, reminder);
  }

  /**
   * Get all reminders for a habit as query.
   */
  public getRemindersForHabitQuery(habitId: string, includeDeleted: boolean = false) {
    return this.db
      .select()
      .from(reminder)
      .where(
        and(
          eq(reminder.habit_id, habitId),
          includeDeleted ? undefined : eq(reminder.isDeleted, false),
        ),
      );
  }

  /**
   * Get all reminders for a habit.
   */
  public async getRemindersForHabit(
    habitId: string,
    includeDeleted: boolean = false,
  ): Promise<Reminder[]> {
    return this.getRemindersForHabitQuery(habitId, includeDeleted);
  }

  /**
   * Delete all reminders for a habit.
   */
  public async deleteRemindersForHabit(habitId: string): Promise<SQLiteRunResult> {
    return this.db
      .update(reminder)
      .set({ isDeleted: true, modifiedAt: new Date().toISOString() })
      .where(eq(reminder.habit_id, habitId));
  }
}
