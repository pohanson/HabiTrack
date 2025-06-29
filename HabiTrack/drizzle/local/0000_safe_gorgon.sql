CREATE TABLE `habit` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`user_id` text NOT NULL,
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`frequencyModifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `habit_completion` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`completedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `habit_milestone` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`week_streak` integer DEFAULT 0 NOT NULL,
	`badges_earned` integer DEFAULT 0 NOT NULL,
	`streak_started_at` text DEFAULT 'inactive',
	`best_day_streak` integer DEFAULT 0,
	`prev_best_day_streak` integer DEFAULT -1,
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reminder` (
	`id` text PRIMARY KEY NOT NULL,
	`day` integer NOT NULL,
	`time` text,
	`habit_id` text NOT NULL,
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`bio` text DEFAULT '',
	`profilePicture` text DEFAULT '',
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);