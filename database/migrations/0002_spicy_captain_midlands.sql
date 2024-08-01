CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	`template_id` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `invoiceTemplates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `templateMarkup` (
	`id` text NOT NULL,
	`template_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	`markup` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `invoiceTemplates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invoiceTemplates` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	`name` text NOT NULL,
	`createdBy` text NOT NULL,
	`schema` text NOT NULL,
	`jsonSchema` text NOT NULL,
	`description` text,
	`tags` text,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`createdBy`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workspaceActivities` (
	`id` text,
	`workspace_id` text NOT NULL,
	`performer` text NOT NULL,
	`event` text NOT NULL,
	`payload` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`performer`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
CREATE UNIQUE INDEX `unique_template_identifier` ON `invoiceTemplates` (`workspace_id`,`name`);