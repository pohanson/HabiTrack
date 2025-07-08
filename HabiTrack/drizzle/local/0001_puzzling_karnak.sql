CREATE TABLE `friend` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`friend_id` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`createdAt` text NOT NULL,
	`modifiedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`friend_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
