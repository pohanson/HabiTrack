import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
const boolean = (fieldName: string) => integer(fieldName, { mode: 'boolean' });

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio').default(''),
  profilePicture: text('profilePicture').default(''),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const habit = sqliteTable('habit', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const reminder = sqliteTable('reminder', {
  id: text('id').primaryKey(),
  day: integer('day').notNull(), // 0-6 for Sunday-Saturday, following js Date.getDay()
  time: text('time'), // Time in HHMM format, null means no reminder
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const habitCompletion = sqliteTable('habit_completion', {
  id: text('id').primaryKey(),
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  completedAt: text('completedAt').notNull(), // date: yyyy-mm-dd
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type User = typeof user.$inferSelect;

export type InsertHabit = typeof habit.$inferInsert;
export type InsertReminder = typeof reminder.$inferInsert;
export type InsertHabitCompletion = typeof habitCompletion.$inferInsert;
export type InsertUser = typeof user.$inferInsert;
