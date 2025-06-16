import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const habit = sqliteTable('habit', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').default(''),
});

export const reminder = sqliteTable('reminder', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  day: integer('day').notNull(), // 0-6 for Sunday-Saturday, following js Date.getDay()
  time: text('time'), // Time in HHMM format, null means no reminder
  habit_id: integer('habit_id')
    .notNull()
    .references(() => habit.id),
});

export const habitCompletion = sqliteTable('habit_completion', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habit_id: integer('habit_id')
    .notNull()
    .references(() => habit.id),
  completedAt: text('completed_at').notNull(), // date: yyyy-mm-dd
});

export const habitMilestone = sqliteTable('habit_milestone', {
  habit_id: integer('habit_id')
    .primaryKey()
    .notNull()
    .references(() => habit.id),
  week_streak: integer('week_streak').notNull().default(10),
  badges_earned: integer('badges_earned').notNull().default(0), // 0 for 0 badges, 1 for 1 badge, 2 for 2 badges, so on, up to 5
});

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type HabitMilestone = typeof habitMilestone.$inferSelect;
