/**
* Project:  IBA Process Review
* File:     valueinfinity-mvp/db/ValueInfinity full.sql
* Descr:    Full SQL for creating tables, views, constraints, and indexes for the ValueInfinity Innovation Platform
*           database.
* Created:  2019-01-08
* Author:   Brad Kaufman
*------------------------------------------------
* Revised:  2019-08-14
* Changes:  Updated Kpis table to include orgPriority column, for prioritzing kpis.
* 
*/
create table if not exists mvp2.KpiTags
(
	kpiId int not null,
	tag varchar(60) not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (kpiId, tag)
);

create index kpiId
	on mvp2.KpiTags (kpiId);

create table if not exists mvp2.Organizations
(
	id int auto_increment
		primary key,
	name varchar(255) not null,
	owningOrg tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table if not exists mvp2.DataSources
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSources_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index DataSources_organization_ind
	on mvp2.DataSources (orgId);

create index DataSources_title_ind
	on mvp2.DataSources (title);

create table if not exists mvp2.Departments
(
	id int auto_increment
		primary key,
	name varchar(100) null,
	description varchar(255) null,
	orgId int null,
	createdAt datetime null,
	updatedAt datetime null,
	constraint Departments_Organizations_id_fk
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
)
comment 'Organization departments';

create fulltext index name
	on mvp2.Departments (name, description);

create table if not exists mvp2.Ideas
(
	id int auto_increment
		primary key,
	name varchar(255) null,
	ideaText text null,
	nodeId varchar(20) null,
	orgId int not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Ideas_Organizations_id_fk
		foreign key (orgId) references mvp2.Organizations (id)
);

create table if not exists mvp2.Kpis
(
	id int auto_increment
		primary key,
	orgId int not null,
	deptId int null,
	title varchar(255) not null,
	description varchar(255) null,
	level int null,
	mindmapNodeId varchar(20) null,
	type varchar(255) null,
	orgPriority int null,
	status varchar(255) null,
	active tinyint default 1 null,
	projectId int null,
	formulaDescription varchar(255) null,
	departmentId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Kpis_Departments_id_fk
		foreign key (deptId) references mvp2.Departments (id),
	constraint Kpis_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Kpis_Organizations_ind
	on mvp2.Kpis (orgId);

create index kpis_title_ind
	on mvp2.Kpis (title);

create fulltext index title
	on mvp2.Kpis (title, description, formulaDescription, type);

create table if not exists mvp2.Mindmaps
(
	id int auto_increment
		primary key,
	orgId int not null,
	mapData json null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Mindmaps_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Mindmaps_Organizations_ind
	on mvp2.Mindmaps (orgId);

create table if not exists mvp2.Persons
(
	id int auto_increment
		primary key,
	orgId int not null,
	firstName varchar(128) null,
	lastName varchar(128) null,
	username varchar(255) null,
	allowLogin tinyint(1) default 0 null,
	email varchar(255) not null,
	deptId int null,
	role varchar(50) null,
	pwdhash varchar(255) not null,
	disabled tinyint(1) default 0 null,
	lastLogin datetime null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	disabledAt datetime null,
	fullName varchar(255) as (concat(`lastName`,_utf8mb4', ',`firstName`)),
	constraint persons_email
		unique (email),
	constraint Persons_Departments_id_fk
		foreign key (deptId) references mvp2.Departments (id),
	constraint Persons_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade
);

create index Persons_Organizations_ind
	on mvp2.Persons (orgId);

create index Persons_login_ind
	on mvp2.Persons (email, pwdhash, disabled);

create table if not exists mvp2.ProjectStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of project statuses';

create table if not exists mvp2.Projects
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	description varchar(512) null,
	summary text null,
	businessGoal varchar(255) null,
	progress int default 0 null,
	currentTaskId int null,
	startAt datetime default CURRENT_TIMESTAMP null,
	endAt date null,
	mindmapId int null,
	nodeId varchar(16) null,
	statusId int null,
	mainKpiId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Projects_ibfk_1
		foreign key (orgId) references mvp2.Organizations (id)
			on delete cascade,
	constraint Projects_ibfk_2
		foreign key (mainKpiId) references mvp2.Kpis (id)
			on delete cascade,
	constraint Projects_ibfk_3
		foreign key (statusId) references mvp2.ProjectStatuses (id)
);

create table if not exists mvp2.DataSets
(
	id int auto_increment
		primary key,
	dataSourceId int not null,
	projectId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSets_ibfk_1
		foreign key (dataSourceId) references mvp2.DataSources (id)
			on delete cascade,
	constraint DataSets_ibfk_2
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade
);

create index DataSets_DataSources_ind
	on mvp2.DataSets (dataSourceId);

create index DataSets_Projects_ind
	on mvp2.DataSets (projectId);

create index DataSets_title_ind
	on mvp2.DataSets (title);

create table if not exists mvp2.KpiProjects
(
	projectId int not null,
	kpiId int not null,
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, kpiId),
	constraint KpiProjects_ibfk_1
		foreign key (kpiId) references mvp2.Kpis (id)
			on delete cascade,
	constraint KpiProjects_ibfk_2
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade
);

create index kpiId
	on mvp2.KpiProjects (kpiId);

create table if not exists mvp2.ProjectPersons
(
	projectId int not null,
	personId int not null,
	inProject tinyint(1) default 0 null,
	owner tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, personId),
	constraint ProjectPersons_ibfk_1
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade,
	constraint ProjectPersons_ibfk_2
		foreign key (personId) references mvp2.Persons (id)
			on delete cascade
);

create index personId
	on mvp2.ProjectPersons (personId);

create index Projects_Mindmap_ind
	on mvp2.Projects (mindmapId, nodeId);

create index Projects_Organizations_ind
	on mvp2.Projects (orgId);

create index Projects_startAt_ind
	on mvp2.Projects (startAt);

create index Projects_title_ind
	on mvp2.Projects (title);

create fulltext index title
	on mvp2.Projects (title, description, summary, businessGoal);

create table if not exists mvp2.SearchData
(
	id int auto_increment
		primary key,
	orgId int null,
	foreignId int not null,
	title varchar(100) null,
	description varchar(255) null,
	summary varchar(255) null,
	project varchar(100) null,
	source varchar(50) null
)
comment 'For building our fulltext search index.';

create fulltext index title
	on mvp2.SearchData (title, description, summary);

create table if not exists mvp2.SequelizeMeta
(
	name varchar(255) not null,
	constraint name
		unique (name)
)
collate=utf8_unicode_ci;

alter table mvp2.SequelizeMeta
	add primary key (name);

create table if not exists mvp2.TaskPriorities
(
	id int not null
		primary key,
	label varchar(30) null,
	priority int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
);

create table if not exists mvp2.TaskStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of task statuses';

create table if not exists mvp2.Milestones
(
	id int auto_increment
		primary key,
	title varchar(255) not null,
	targetDate date null,
	description varchar(255) null,
	orgId int not null,
	statusId int default 1 null,
	active tinyint default 1 null,
	projectId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Milestones_Projects_id_fk
		foreign key (projectId) references mvp2.Projects (id),
	constraint Milestones_TaskStatuses_id_fk
		foreign key (statusId) references mvp2.TaskStatuses (id)
);

create fulltext index title
	on mvp2.Milestones (title, description);

create table if not exists mvp2.Tasks
(
	id int auto_increment
		primary key,
	projectId int not null,
	assignedTo int not null,
	title varchar(255) not null,
	description varchar(255) null,
	comments varchar(255) null,
	priorityId int default 3 null,
	milestoneId int null,
	statusId int default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Tasks_ibfk_1
		foreign key (projectId) references mvp2.Projects (id)
			on delete cascade,
	constraint Tasks_ibfk_2
		foreign key (assignedTo) references mvp2.Persons (id)
			on delete cascade,
	constraint Tasks_ibfk_3
		foreign key (statusId) references mvp2.TaskStatuses (id)
			on delete cascade,
	constraint Tasks_ibfk_4
		foreign key (priorityId) references mvp2.TaskPriorities (id)
			on delete cascade,
	constraint Tasks_ibfk_5
		foreign key (milestoneId) references mvp2.Milestones (id)
);

alter table mvp2.Projects
	add constraint Projects_ibfk_4
		foreign key (currentTaskId) references mvp2.Tasks (id);

create index Tasks_Projects_ind
	on mvp2.Tasks (projectId);

create index Tasks_assignedTo_ind
	on mvp2.Tasks (assignedTo);

create fulltext index title
	on mvp2.Tasks (title, description);

