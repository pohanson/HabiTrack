import { habit, HabitMilestone, habitMilestone } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncableRepository';

export class HabitMilestoneRepository extends SyncableRepository<HabitMilestone> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, habitMilestone);
  }

  /**
   * Get all habit milestones as a query.
   * @returns obj with the following properties:
   * habit_id, habit_name, week_streak, badges_earned,
   */
  getAllMilestoneQuery(userId: string | null, includeDeleted: boolean = false) {
    return this.db
      .select({
        habit_id: habit.id,
        habit_name: habit.name,
        week_streak: habitMilestone.week_streak,
        badges_earned: habitMilestone.badges_earned,
      })
      .from(habitMilestone)
      .where(includeDeleted ? undefined : eq(habitMilestone.isDeleted, includeDeleted))
      .innerJoin(
        habit,
        and(eq(habit.id, habitMilestone.habit_id), userId ? eq(habit.user_id, userId) : undefined),
      );
  }

  /**
   * Get all milestones for a habit as a query.
   */
  public getMilestonesByHabitIdQuery(habitId: string, includeDeleted: boolean = false) {
    return this.db
      .select()
      .from(habitMilestone)
      .where(
        and(
          eq(habitMilestone.habit_id, habitId),
          includeDeleted ? undefined : eq(habitMilestone.isDeleted, includeDeleted),
        ),
      );
  }

  /**
   * Update milestones for a habit by habit Id.
   */
  public updateByHabitId(habitId: string, updates: Partial<HabitMilestone>) {
    return this.db
      .update(habitMilestone)
      .set({ ...updates, modifiedAt: new Date().toISOString() })
      .where(eq(habitMilestone.habit_id, habitId))
      .execute();
  }

  /**
   * Delete all milestones for a habit by habit Id.
   */
  public deleteByHabitId(habitId: string) {
    return this.db
      .update(habitMilestone)
      .set({ isDeleted: true, modifiedAt: new Date().toISOString() })
      .where(eq(habitMilestone.habit_id, habitId))
      .execute();
  }
}
