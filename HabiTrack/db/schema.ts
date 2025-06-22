import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
const boolean = (fieldName: string) => integer(fieldName, { mode: 'boolean' });

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio').default(''),
  profilePicture: text('profile_picture').default(''),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modified_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const habit = sqliteTable('habit', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modified_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const reminder = sqliteTable('reminder', {
  id: text('id').primaryKey(),
  day: integer('day').notNull(), // 0-6 for Sunday-Saturday, following js Date.getDay()
  time: text('time'), // Time in HHMM format, null means no reminder
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modified_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const habitCompletion = sqliteTable('habit_completion', {
  id: text('id').primaryKey(),
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  completedAt: text('completed_at').notNull(), // date: yyyy-mm-dd
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modified_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const habitMilestone = sqliteTable('habit_milestone', {
  habit_id: text('habit_id')
    .primaryKey()
    .notNull()
    .references(() => habit.id),
  week_streak: integer('week_streak').notNull().default(0),
  badges_earned: integer('badges_earned').notNull().default(0), // 0 for 0 badges, 1 for 1 badge, 2 for 2 badges, so on, up to 5
  streak_started_at: text('streak_started_at').default('inactive'), // date: yyyy-mm-dd
  best_day_streak: integer('best_day_streak').default(0),
  prev_best_day_streak: integer('prev_best_day_streak').default(-1),
});

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type HabitMilestone = typeof habitMilestone.$inferSelect;
export type User = typeof user.$inferSelect;

export type HabitCompletionInsert = typeof habitCompletion.$inferInsert;