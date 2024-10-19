CREATE TABLE `invoiceMetadata` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`sent_to` text NOT NULL,
	`last_updated` integer NOT NULL,
	`cc` text,
	`bcc` text,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`opened_at` integer,
	`created_at` integer DEFAULT 1729328708824,
	`updated_at` integer DEFAULT 1729328708824,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invoiceRemarks` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`member_id` text,
	`remark` text NOT NULL,
	`type` text NOT NULL,
	`visibility` text NOT NULL,
	`priority` integer DEFAULT 0,
	`created_at` integer DEFAULT 1729328708824,
	`updated_at` integer DEFAULT 1729328708824,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `templateIntegration` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`created_at` integer DEFAULT 1729328708824,
	`updated_at` integer DEFAULT 1729328708824,
	`integration_key` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `invoiceTemplates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/