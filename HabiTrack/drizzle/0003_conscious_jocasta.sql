PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit_milestone` (
	`habit_id` integer PRIMARY KEY NOT NULL,
	`week_streak` integer DEFAULT 0 NOT NULL,
	`badges_earned` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_habit_milestone`("habit_id", "week_streak", "badges_earned") SELECT "habit_id", "week_streak", "badges_earned" FROM `habit_milestone`;--> statement-breakpoint
DROP TABLE `habit_milestone`;--> statement-breakpoint
ALTER TABLE `__new_habit_milestone` RENAME TO `habit_milestone`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `habit` ADD `createdAt` text NOT NULL;