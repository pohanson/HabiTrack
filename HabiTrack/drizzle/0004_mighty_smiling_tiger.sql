ALTER TABLE `habit_milestone` ADD `streak_started_at` text DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE `habit_milestone` ADD `best_day_streak` integer DEFAULT 0;