import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const habit = sqliteTable('habit', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').default(''),
});

export const reminder = sqliteTable('reminder', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  day: integer('day').notNull(), // 1-7 for Mon-Sun
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

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
