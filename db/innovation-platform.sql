CREATE TABLE `person` 
(
	`id` int,
	`full_name` varchar(255),
	`username` varchar(255),
	`email` varchar(255),
	`created_at` datetime,
	`updated_at` datetime
);

CREATE TABLE `organization` 
(
	`id` int,
	`user_id` int,
	`name` varchar(255),
	`created_at` datetime,
	`updated_at` datetime
);

CREATE TABLE `clientproject` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `org_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `business_goal` varchar(255) DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=innodb DEFAULT CHARSET=latin1;

CREATE TABLE `clientprojectowner` 
(
	`id` int,
	`person_id` int,
	`project_id` int,
	`created_at` datetime,
	`updated_at` datetime
);

CREATE TABLE `projectkpi` 
(
	`id` int,
	`project_id` int,
	`kpi_id` int,
	`created_at` datetime,
	`updated_at` datetime
);

CREATE TABLE `action` 
(
	`id` int,
	`project_id` int,
	`user_id` int,
	`title` varchar(255),
	`description` varchar(255),
	`status` varchar(255),
	`created_at` varchar(255),
	`updated_at` datetime
);

CREATE TABLE `dataset` 
(
	`id` int,
	`project_id` int,
	`database_id` int,
	`org_id` int,
	`description` varchar(255),
	`source_file` varchar(255),
	`created_at` varchar(255),
	`updated_at` datetime
);

CREATE TABLE `database` 
(
	`id` int,
	`org_id` int,
	`description` varchar(255),
	`source_file` varchar(255),
	`created_at` varchar(255),
	`updated_at` datetime
);

CREATE TABLE `kpi` 
(
	`id` int,
	`name` varchar(255),
	`description` varchar(255),
	`level` int,
	`type` varchar(255),
	`status` varchar(255),
	`created_at` varchar(255),
	`updated_at` datetime
);

ALTER TABLE `organization` ADD FOREIGN KEY (`user_id`) REFERENCES `person` (`id`);

ALTER TABLE `projectkpi` ADD FOREIGN KEY (`kpi_id`) REFERENCES `kpi` (`id`);

ALTER TABLE `clientproject` ADD FOREIGN KEY (`org_id`) REFERENCES `organization` (`id`);

ALTER TABLE `dataset` ADD FOREIGN KEY (`org_id`) REFERENCES `organization` (`id`);

ALTER TABLE `dataset` ADD FOREIGN KEY (`database_id`) REFERENCES `database` (`id`);

ALTER TABLE `projectkpi` ADD FOREIGN KEY (`project_id`) REFERENCES `clientproject` (`id`);

ALTER TABLE `action` ADD FOREIGN KEY (`project_id`) REFERENCES `clientproject` (`id`);

ALTER TABLE `clientprojectowner` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

ALTER TABLE `clientprojectowner` ADD FOREIGN KEY (`project_id`) REFERENCES `clientproject` (`id`);
