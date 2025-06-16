CREATE TABLE `habit_milestone` (
	`habit_id` integer PRIMARY KEY NOT NULL,
	`week_streak` integer DEFAULT 10 NOT NULL,
	`badges_earned` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
