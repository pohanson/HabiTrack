import { habit, Habit, habitCompletion, habitMilestone, reminder } from '@/db/schema';
import { and, asc, eq, max, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncRepository';

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
   * Get all habits for a user with today's completions, reminder, milestone as a query.
   * @param userId - The ID of the user to filter habits by. If null, retrieves all habits.
   */
  public getAllHabitsTodayQuery(userId: string | null, includeDeleted: boolean = false) {
    const today = new Date().toJSON().split('T')[0];
    const dayOfWeek = new Date().getDay();
    return this.db
      .select({
        habit: habit,
        habit_completion: habitCompletion,
        reminder: reminder,
        habit_milestone: habitMilestone,
      })
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
      .leftJoin(habitMilestone, eq(habit.id, habitMilestone.habit_id))
      .orderBy(asc(habitCompletion.completedAt), asc(reminder.time));
  }

  /**
   * Get habit statistics and reminder days for a given habit.
   */
  public getHabitStatsWithRemindersQuery() {
    return (
      this.db
        .select({
          habit_id: habit.id,
          last_completed_at: max(habitCompletion.completedAt),
          day_frequency: sql`json_group_array(DISTINCT ${reminder.day} ORDER BY ${reminder.day} ASC)`,

          // here for testing for now
          week_streak: habitMilestone.week_streak,

          streak_started_at: habitMilestone.streak_started_at,
          best_day_streak: habitMilestone.best_day_streak,
        })
        .from(habit)
        .leftJoin(habitMilestone, eq(habit.id, habitMilestone.habit_id))
        .innerJoin(reminder, eq(habit.id, reminder.habit_id))

        // here for testing for now
        .leftJoin(habitCompletion, eq(habit.id, habitCompletion.habit_id))

        .groupBy(habit.id)
    );
  }
}
