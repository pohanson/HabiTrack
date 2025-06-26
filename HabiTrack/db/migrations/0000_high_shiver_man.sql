CREATE TABLE `habit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit_completion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`completed_at` text NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `habit_milestone` (
	`habit_id` integer PRIMARY KEY NOT NULL,
	`week_streak` integer DEFAULT 0 NOT NULL,
	`badges_earned` integer DEFAULT 0 NOT NULL,
	`streak_started_at` text DEFAULT 'inactive',
	`best_day_streak` integer DEFAULT 0,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reminder` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` integer NOT NULL,
	`time` text,
	`habit_id` integer NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
