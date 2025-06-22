import { Reminder, reminder } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncRepository';
import { SQLiteRunResult } from 'expo-sqlite';

export class ReminderRepository extends SyncableRepository<Reminder> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, reminder);
  }

  /**
   * Get all reminders for a habit.
   */
  public async getRemindersForHabit(
    habitId: string,
    includeDeleted: boolean = false,
  ): Promise<Reminder[]> {
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
   * Delete all reminders for a habit.
   */
  public async deleteRemindersForHabit(habitId: string): Promise<SQLiteRunResult> {
    return this.db
      .update(reminder)
      .set({ isDeleted: true, modifiedAt: new Date().toISOString() })
      .where(eq(reminder.habit_id, habitId));
  }
}
