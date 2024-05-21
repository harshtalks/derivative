CREATE TABLE `authenticators` (
	`cred_id` text PRIMARY KEY NOT NULL,
	`internal_user_id` text NOT NULL,
	`webauthn_user_id` text NOT NULL,
	`counter` integer NOT NULL,
	`backup_eligible` integer NOT NULL,
	`backup_status` integer NOT NULL,
	`cred_public_key` blob NOT NULL,
	`transports` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	FOREIGN KEY (`internal_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`github_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	`avatar` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`two_factor_enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);