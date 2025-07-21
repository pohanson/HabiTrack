import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
const boolean = (fieldName: string) => integer(fieldName, { mode: 'boolean' });

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
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
  frequencyModifiedAt: text('frequencyModifiedAt')
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

export const habitMilestone = sqliteTable('habit_milestone', {
  id: text('id').primaryKey(),
  habit_id: text('habit_id')
    .notNull()
    .references(() => habit.id),
  week_streak: integer('week_streak').notNull().default(0),
  badges_earned: integer('badges_earned').notNull().default(0), // 0 for 0 badges, 1 for 1 badge, 2 for 2 badges, so on, up to 5
  streak_started_at: text('streak_started_at').default('inactive'), // date: yyyy-mm-dd
  best_day_streak: integer('best_day_streak').default(0),
  prev_best_day_streak: integer('prev_best_day_streak').default(-1),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const friend = sqliteTable('friend', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id),
  friend_id: text('friend_id')
    .notNull()
    .references(() => user.id),
  status: text('status').notNull().default('PENDING'), // PENDING, ACCEPTED, REJECTED
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  modifiedAt: text('modifiedAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const group = sqliteTable('group', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  admin_id: text('admin_id')
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

export const groupMember = sqliteTable('group_member', {
  id: text('id').primaryKey(),
  group_id: text('group_id')
    .notNull()
    .references(() => group.id),
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

export type Habit = typeof habit.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type HabitCompletion = typeof habitCompletion.$inferSelect;
export type User = typeof user.$inferSelect;
export type HabitMilestone = typeof habitMilestone.$inferSelect;
export type Friend = typeof friend.$inferSelect;
export type Group = typeof group.$inferSelect;
export type GroupMember = typeof groupMember.$inferSelect;

export type InsertHabit = typeof habit.$inferInsert;
export type InsertReminder = typeof reminder.$inferInsert;
export type InsertHabitCompletion = typeof habitCompletion.$inferInsert;
export type InsertUser = typeof user.$inferInsert;
export type InsertHabitMilestone = typeof habitMilestone.$inferInsert;
export type InsertFriend = typeof friend.$inferInsert;
export type InsertGroup = typeof group.$inferInsert;
export type InsertGroupMember = typeof groupMember.$inferInsert;
