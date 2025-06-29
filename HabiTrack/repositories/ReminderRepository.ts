import { Reminder, reminder } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteRunResult } from 'expo-sqlite';
import { SyncableRepository } from './SyncableRepository';

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

  /**
   * Get the latest modified at date of the frequency of a habit (as yyyy-mm-dd string)
   * (Inclusive of deleted reminders)
   */
  public async getLatestFrequencyModifiedAtForHabit(habitId: string): Promise<string | null> {
    const reminders = await this.getRemindersForHabit(habitId, true);

    // to map each day to its last modifiedAt date
    const dayToLatestModifiedAtMapping: Record<number, string> = {};

    for (const reminder of reminders) {
      const day = reminder.day;
      const modifiedAt = reminder.modifiedAt;

      if (
        !dayToLatestModifiedAtMapping[day] ||
        new Date(modifiedAt) > new Date(dayToLatestModifiedAtMapping[day])
      ) {
        dayToLatestModifiedAtMapping[day] = modifiedAt;
      }
    }

    console.log(dayToLatestModifiedAtMapping);
    const latestModifiedAt =
      Object.values(dayToLatestModifiedAtMapping).sort().reverse()[0] || null;
    const latestModifiedDate = latestModifiedAt?.split('T')[0] || null;
    return latestModifiedDate;
  }
}
