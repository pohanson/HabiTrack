import { HabitMilestone, habitMilestone } from '@/db/localSchema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SyncableRepository } from './SyncRepository';

export class HabitMilestoneRepository extends SyncableRepository<HabitMilestone> {
  constructor(db: ReturnType<typeof drizzle>) {
    super(db, habitMilestone);
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
}
