import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
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

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type User = typeof user.$inferSelect;

// Exportable insert types for client usage
export type InsertHabit = typeof habit.$inferInsert;
export type InsertReminder = typeof reminder.$inferInsert;
export type InsertHabitCompletion = typeof habitCompletion.$inferInsert;
export type InsertUser = typeof user.$inferInsert;
