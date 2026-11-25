CREATE TABLE `page_versions` (
	`id` varchar(36) NOT NULL,
	`page_id` varchar(36) NOT NULL,
	`version` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`summary` varchar(500),
	`content` json NOT NULL,
	`seo_title` varchar(255),
	`seo_description` varchar(320),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_versions_page_version_unique` UNIQUE(`page_id`,`version`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`route_path` varchar(255) NOT NULL,
	`page_type` enum('home','about','privacy','service','system') NOT NULL DEFAULT 'system',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`published_version_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_route_path_unique` UNIQUE(`route_path`)
);
--> statement-breakpoint
ALTER TABLE `page_versions` ADD CONSTRAINT `page_versions_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `page_versions_status_idx` ON `page_versions` (`status`);--> statement-breakpoint
CREATE INDEX `pages_status_idx` ON `pages` (`status`);