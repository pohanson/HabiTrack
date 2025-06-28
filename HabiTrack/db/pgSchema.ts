import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  bio: text('bio').default(''),
  profilePicture: text('profilePicture').default(''),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  modifiedAt: timestamp('modifiedAt', { withTimezone: true }).notNull().defaultNow(),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const habit = pgTable('habit', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  modifiedAt: timestamp('modifiedAt', { withTimezone: true }).notNull().defaultNow(),
  frequencyModifiedAt: timestamp('frequencyModifiedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const reminder = pgTable('reminder', {
  id: text('id').primaryKey(),
  day: integer('day').notNull(), // 0-6 for Sunday-Saturday, following js Date.getDay()
  time: text('time'), // Time in HHMM format, null means no reminder
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  modifiedAt: timestamp('modifiedAt', { withTimezone: true }).notNull().defaultNow(),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const habitCompletion = pgTable('habit_completion', {
  id: text('id').primaryKey(),
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  completedAt: timestamp('completedAt', { withTimezone: true }).notNull(), // date and time of completion
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  modifiedAt: timestamp('modifiedAt', { withTimezone: true }).notNull().defaultNow(),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const habit_milestone = pgTable('habit_milestone', {
  id: text('id').primaryKey(),
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  week_streak: integer('week_streak').notNull().default(0),
  badges_earned: integer('badges_earned').notNull().default(0), // 0 for 0 badges, 1 for 1 badge, 2 for 2 badges, so on, up to 5
  streak_started_at: text('streak_started_at').default('inactive'), // date: yyyy-mm-dd
  best_day_streak: integer('best_day_streak').default(0),
  prev_best_day_streak: integer('prev_best_day_streak').default(-1),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  modifiedAt: timestamp('modifiedAt', { withTimezone: true }).notNull().defaultNow(),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type User = typeof user.$inferSelect;
export type HabitMilestone = typeof habit_milestone.$inferSelect;

export type InsertHabit = typeof habit.$inferInsert;
export type InsertReminder = typeof reminder.$inferInsert;
export type InsertHabitCompletion = typeof habitCompletion.$inferInsert;
export type InsertUser = typeof user.$inferInsert;
export type InsertHabitMilestone = typeof habit_milestone.$inferInsert;
