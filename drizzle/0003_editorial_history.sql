CREATE TABLE `cms_page_audit_events` (
	`id` varchar(36) NOT NULL,
	`page_id` varchar(36) NOT NULL,
	`actor_user_id` varchar(36),
	`action` enum('page_created','draft_saved','published','unpublished','restored') NOT NULL,
	`version_id` varchar(36),
	`source_version_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cms_page_audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cms_global_content` (
	`id` varchar(20) NOT NULL,
	`values` json NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_global_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cms_media_assets` ADD `source_path` varchar(1000);--> statement-breakpoint
ALTER TABLE `cms_media_assets` ADD `width` int;--> statement-breakpoint
ALTER TABLE `cms_media_assets` ADD `height` int;--> statement-breakpoint
ALTER TABLE `cms_media_assets` ADD `created_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `page_versions` ADD `created_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `cms_page_audit_events` ADD CONSTRAINT `cms_page_audit_events_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cms_page_audit_events` ADD CONSTRAINT `cms_page_audit_events_actor_user_id_user_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cms_page_audit_events` ADD CONSTRAINT `cms_page_audit_events_version_id_page_versions_id_fk` FOREIGN KEY (`version_id`) REFERENCES `page_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cms_page_audit_events` ADD CONSTRAINT `cms_page_audit_events_source_version_id_page_versions_id_fk` FOREIGN KEY (`source_version_id`) REFERENCES `page_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `cms_page_audit_events_page_created_idx` ON `cms_page_audit_events` (`page_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `cms_page_audit_events_actor_idx` ON `cms_page_audit_events` (`actor_user_id`);--> statement-breakpoint
ALTER TABLE `cms_media_assets` ADD CONSTRAINT `cms_media_assets_created_by_user_id_user_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_versions` ADD CONSTRAINT `page_versions_created_by_user_id_user_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `cms_media_assets_created_by_idx` ON `cms_media_assets` (`created_by_user_id`);--> statement-breakpoint
CREATE INDEX `page_versions_created_by_idx` ON `page_versions` (`created_by_user_id`);