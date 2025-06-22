import { habit, Habit, habitCompletion, reminder } from '@/db/schema';
import { SyncableRepository } from './SyncRepository';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { and, asc, eq } from 'drizzle-orm';

export class HabitRepository extends SyncableRepository<Habit> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, habit);
  }

  /**
   * Get all habits for a user as a query.
   */
  public getHabitsByUserIdQuery(userId: string, includeDeleted: boolean = false) {
    return this.db
      .select()
      .from(habit)
      .where(
        and(
          eq(habit.user_id, userId),
          includeDeleted ? undefined : eq(habit.isDeleted, includeDeleted),
        ),
      );
  }

  /**
   * Get habit with reminder given a habitId as a query.
   */
  public getHabitWithRemindersQuery(habitId: string, includeDeleted: boolean = false) {
    return this.db
      .select({ habit: habit, reminder: reminder })
      .from(habit)
      .leftJoin(reminder, eq(habit.id, reminder.habit_id))
      .where(
        and(
          eq(habit.id, habitId),
          includeDeleted ? undefined : eq(reminder.isDeleted, false),
          includeDeleted ? undefined : eq(habit.isDeleted, false),
        ),
      );
  }

  /**
   * Get all habits for a user with today's completions and reminder as a query.
   * @param userId - The ID of the user to filter habits by. If null, retrieves all habits.
   */
  public getAllHabitsWithTodayCompletionsQuery(
    userId: string | null,
    includeDeleted: boolean = false,
  ) {
    const today = new Date().toJSON().split('T')[0];
    const dayOfWeek = new Date().getDay();
    return this.db
      .select({ habit: habit, habit_completion: habitCompletion, reminder: reminder })
      .from(reminder)
      .innerJoin(
        habit,
        and(
          eq(reminder.habit_id, habit.id),
          userId == null ? undefined : eq(habit.user_id, userId),
        ),
      )
      .leftJoin(
        habitCompletion,
        and(
          eq(habit.id, habitCompletion.habit_id),
          eq(habitCompletion.completedAt, today),
          includeDeleted ? undefined : eq(habitCompletion.isDeleted, false),
        ),
      )
      .where(
        and(
          eq(reminder.day, dayOfWeek),
          includeDeleted
            ? undefined
            : and(eq(reminder.isDeleted, false), eq(habit.isDeleted, false)),
        ),
      )
      .orderBy(asc(habitCompletion.completedAt), asc(reminder.time));
  }
}
